import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    minRating: '',
    minReviews: ''
  });
  const [sortOption, setSortOption] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);

  // Функция запроса данных с backend
  const fetchProducts = async () => {
    try {
      // Передаем параметры фильтров и сортировки в качестве query-параметров
      const params = {
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        min_rating: filters.minRating,
        min_reviews: filters.minReviews,
        sort_by: sortOption,
        sort_order: sortOrder,
      };
      const response = await axios.get('/api/products', { params });
      setProducts(response.data);

      // Вычисляем реальные min и max цены для обновления слайдера
      const prices = response.data.map(p => p.price).filter(Boolean);
      if (prices.length) {
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));
      }
    } catch (error) {
      console.error('Ошибка при получении товаров', error);
    }
  };

  // Обновляем данные при изменении фильтров или параметров сортировки
  useEffect(() => {
    fetchProducts();
  }, [filters, sortOption, sortOrder]);

  return (
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Таблица товаров и аналитика
        </Typography>
        <Filters
            filters={filters}
            setFilters={setFilters}
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setPriceRange={(newRange) =>
                setFilters(prev => ({ ...prev, priceRange: newRange }))
            }
        />
        <ProductTable products={products} />
        <Charts products={products} />
      </Container>
  );
};

export default App;