import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const Charts = ({ products }) => {
    // Подготовка данных для гистограммы распределения цен
    const priceBuckets = [
        { range: '0-100', count: 0 },
        { range: '101-200', count: 0 },
        { range: '201-300', count: 0 },
        { range: '301+', count: 0 },
    ];

    products.forEach(prod => {
        if (prod.price <= 100) priceBuckets[0].count += 1;
        else if (prod.price <= 200) priceBuckets[1].count += 1;
        else if (prod.price <= 300) priceBuckets[2].count += 1;
        else priceBuckets[3].count += 1;
    });

    // Подготовка данных для линейного графика: скидка в процентах versus рейтинг
    // Скидка рассчитывается как ((price - discount_price) / price) * 100
    const discountData = products.map(prod => {
        const discount =
            prod.price && prod.discount_price
                ? ((prod.price - prod.discount_price) / prod.price) * 100
                : 0;
        return {
            rating: prod.rating,
            discount: Math.round(discount * 10) / 10,
        };
    });

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom>
                Гистограмма цен
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceBuckets}>
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Линейный график: Скидка (%) vs Рейтинг
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={discountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" type="number" domain={['auto', 'auto']} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="discount" stroke="#82ca9d" name="Скидка (%)" />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default Charts;