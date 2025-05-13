import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard.js';
import { Container, Row, Col } from 'react-bootstrap';

const RecommendationGrid = () => {
  const { productItems } = useContext(AppContext);
  // console.log("Product items:", productItems);
  return (
    <div className="recommendation-section mb-4">
      <div className="section-header p-3">
        <h3 className="mb-0">Gợi ý cho bạn</h3>
      </div>
      
      <Container fluid>
        <Row xs={2} md={3} lg={6} className="g-3">
          {productItems.map((product) => (
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