import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const ProductGrid = () => {
  const { productItems, fetchProductData } = useContext(AppContext);

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <Container className="py-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {productItems && productItems.map((product, idx) => (
          <Col key={product._id || idx}>
            <ProductCard 
              product={{
                name: product.name,
                image: product.image,
                ram: product.specifications?.ram || 'N/A',
                ssd: product.specifications?.storage || 'N/A',
                price: product.price,
                originalPrice: product.originalPrice,
                installmentAmount: product.installmentAmount,
                rating: product.rating || 4.5,
                soldCount: product.soldCount || 0
              }} 
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid; 