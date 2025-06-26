import React from 'react';
import { Box, Slider, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const Filters = ({ filters, setFilters, sortOption, setSortOption, sortOrder, setSortOrder, minPrice, maxPrice, setPriceRange }) => {
    // Обработчик изменения слайдера для диапазона цен
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
        setFilters({ ...filters, priceRange: newValue });
    };

    // Обработчик изменения текстовых фильтров
    const handleInputChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <Box sx={{ my: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {/* Слайдер для диапазона цен */}
            <Box sx={{ width: 250 }}>
                <InputLabel>Цена</InputLabel>
                <Slider
                    value={filters.priceRange || [minPrice, maxPrice]}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={minPrice}
                    max={maxPrice}
                />
            </Box>

            {/* Фильтр по минимальному рейтингу */}
            <TextField
                name="minRating"
                label="Минимальный рейтинг"
                type="number"
                value={filters.minRating || ''}
                onChange={handleInputChange}
            />

            {/* Фильтр по минимальному количеству отзывов */}
            <TextField
                name="minReviews"
                label="Минимальное количество отзывов"
                type="number"
                value={filters.minReviews || ''}
                onChange={handleInputChange}
            />

            {/* Селект для выбора параметра сортировки */}
            <FormControl sx={{ width: 200 }}>
                <InputLabel>Сортировать по</InputLabel>
                <Select
                    value={sortOption}
                    label="Сортировать по"
                    onChange={handleSortChange}
                >
                    <MenuItem value="rating">Рейтинг</MenuItem>
                    <MenuItem value="review_count">Количество отзывов</MenuItem>
                    <MenuItem value="price">Цена</MenuItem>
                    <MenuItem value="name">Название</MenuItem>
                </Select>
            </FormControl>

            {/* Селект для порядка сортировки */}
            <FormControl sx={{ width: 200 }}>
                <InputLabel>Порядок</InputLabel>
                <Select
                    value={sortOrder}
                    label="Порядок"
                    onChange={handleSortOrderChange}
                >
                    <MenuItem value="asc">По возрастанию</MenuItem>
                    <MenuItem value="desc">По убыванию</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default Filters;