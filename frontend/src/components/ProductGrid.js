import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const ProductGrid = ({ products, cols = { xs: 2, sm: 3, md: 4, lg: 6 } }) => {
  const { productItems, fetchProductData } = useContext(AppContext);

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <Container className="py-4">
      <Row xs={cols.xs} sm={cols.sm} md={cols.md} lg={cols.lg} className="g-3">
        {productItems && productItems.map((product) => (
          <Col key={product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid; 