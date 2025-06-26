import json
import requests
from bs4 import BeautifulSoup

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer


@api_view(['GET'])
def product_list(request):
    """
    Возвращает список товаров с возможностью фильтрации по параметрам:
    min_price, max_price, min_rating, min_reviews.
    """
    qs = Product.objects.all()
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    min_rating = request.GET.get('min_rating')
    min_reviews = request.GET.get('min_reviews')

    if min_price:
        qs = qs.filter(price__gte=float(min_price))
    if max_price:
        qs = qs.filter(price__lte=float(max_price))
    if min_rating:
        qs = qs.filter(rating__gte=float(min_rating))
    if min_reviews:
        qs = qs.filter(review_count__gte=int(min_reviews))

    serializer = ProductSerializer(qs, many=True)
    return JsonResponse(serializer.data, safe=False)


proxies = {
    'http': 'http://182.52.17.131:8080',
}

CATEGORY_MAPPING = {
    'здоровое питание': '10299',
    'подарки': '130603',
    'электроника': '12345',
}


def get_category(cat_id):
    """
    Получает данные с Wildberries для заданной категории по идентификатору.
    """
    url = (
        "https://catalog.wb.ru/catalog/gift11/catalog?"
        "cat={cat}&limit=100&sort=popular&page=1&appType=128&curr=byn&locale=by&lang=ru&"
        "dest=-59202&regions=1,4,22,30,31,33,40,48,66,68,69,70,80,83,111,114,115&reg=1&spp=25"
    ).format(cat=cat_id)

    headers = {
        'Accept': '*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Origin': 'https://www.wildberries.by',
        'Referer': 'https://www.wildberries.by/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                      'AppleWebKit/537.36 (KHTML, like Gecko) '
                      'Chrome/111.0.0.0 Safari/537.36',
        'sec-ch-ua': 'Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'macOS',
    }

    try:
        response = requests.get(url=url, headers=headers, proxies=proxies, timeout=15)
        response.raise_for_status()
    except Exception as e:
        print(f"Ошибка при запросе данных для категории {cat_id}: {e}")
        return {}

    return response.json()


def prepare_items(response):
    products = []
    products_raw = response.get('data', {}).get('products', None)

    if products_raw is not None and len(products_raw) > 0:
        for product in products_raw:
            try:
                products.append({
                    'name': product.get('name'),
                    'price': float(product.get('priceU')) / 100 if product.get('priceU') else None,
                    'discount_price': float(product.get('salePriceU')) / 100 if product.get('salePriceU') else None,
                    'rating': product.get('rating'),
                    'review_count': product.get('feedbacks'),
                })
            except Exception as e:
                print(f"Ошибка при подготовке товара: {e}")
                continue
    return products


@csrf_exempt
@api_view(['POST'])
def parse_products(request):
    """
    Получает POST-запрос с параметром "query", который содержит название категории.
    На основе словаря CATEGORY_MAPPING определяет соответствующий идентификатор категории,
    выполняет запрос на Wildberries и сохраняет полученные товары в базу данных.
    """
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({'error': 'Неверный формат данных'}, status=400)

    category_name = data.get('query')
    if not category_name:
        return JsonResponse({'error': 'Параметр "query" обязателен и должен содержать название категории'}, status=400)

    # Приводим название категории к нижнему регистру для корректного сопоставления
    cat_id = CATEGORY_MAPPING.get(category_name.lower())
    if not cat_id:
        return JsonResponse({
            'error': f'Категория с названием "{category_name}" не найдена. Доступны следующие категории: {list(CATEGORY_MAPPING.keys())}'
        }, status=400)

    response = get_category(cat_id)
    if not response:
        return JsonResponse({'error': 'Не удалось получить данные с Wildberries'}, status=500)

    parsed_products = prepare_items(response)
    if not parsed_products:
        return JsonResponse({'error': 'Не удалось спарсить данные с Wildberries'}, status=500)

    for prod in parsed_products:
        Product.objects.create(**prod)

    return JsonResponse({'message': 'Парсинг завершён', 'results': parsed_products})

# TODO: Фронт, возможность по категориям парсить