import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard.js';
import { Container, Row, Col } from 'react-bootstrap';

const RecommendationGrid = ({ products }) => {
  const { productItems } = useContext(AppContext);
  
  // Use passed products or fallback to context products
  const displayProducts = products && products.length > 0 ? products : productItems;
  
  return (
    <div className="recommendation-section mb-4">
      <div className="section-header p-3">
        <h3 className="mb-0">Gợi ý cho bạn</h3>
      </div>
      
      <Container fluid>
        <Row xs={2} md={3} lg={6} className="g-3">
          {displayProducts.map((product) => (
            <Col key={product._id}>
              <ProductCard 
                product={product}
                showProgress={false}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default RecommendationGrid; 