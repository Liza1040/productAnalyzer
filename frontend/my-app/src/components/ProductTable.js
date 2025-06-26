import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ProductTable = ({ products }) => {
    return (
        <TableContainer component={Paper} sx={{ my: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Название товара</TableCell>
                        <TableCell>Цена</TableCell>
                        <TableCell>Цена со скидкой</TableCell>
                        <TableCell>Рейтинг</TableCell>
                        <TableCell>Количество отзывов</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((prod, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{prod.name}</TableCell>
                            <TableCell>{prod.price}</TableCell>
                            <TableCell>{prod.discount_price}</TableCell>
                            <TableCell>{prod.rating}</TableCell>
                            <TableCell>{prod.review_count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;