import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';

// Функция для сортировки товаров на стороне клиента
const sortProducts = (data, sortOption, sortOrder) => {
  if (!data || data.length === 0 || !sortOption) return data;
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortOption];
    const bValue = b[sortOption];

    // Если значения строковые, используем localeCompare
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
    }

    // Если значения числовые, выполняем арифметическую сортировку
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return sortedData;
};

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

  // Получение данных с backend и сортировка на клиенте
  const fetchProducts = async () => {
    try {
      const params = {
        min_price: filters.priceRange[0],
        max_price: filters.priceRange[1],
        min_rating: filters.minRating,
        min_reviews: filters.minReviews,
      };

      const response = await axios.get('/api/products', { params });
      let data = response.data;

      // Сортировка товаров на стороне клиента
      data = sortProducts(data, sortOption, sortOrder);

      setProducts(data);

      // Вычисление минимальной и максимальной цены для слайдера
      const prices = data.map(item => item.price).filter(Boolean);
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