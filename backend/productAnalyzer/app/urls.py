from django.urls import path

from .views import product_list, parse_products

urlpatterns = [
    path('api/products/', product_list, name='product-list'),
    path('api/parse/', parse_products, name='parse-products'),
]
