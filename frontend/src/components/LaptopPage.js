import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext.js';
import ProductCard from './ProductCard.js';
import { Container, Row, Col } from 'react-bootstrap';

const LaptopPage = () => {
    const {productItems} = useContext(AppContext);
    
  return (
    <div className="recommendation-section mb-4">
      <div className="section-header p-3">
        <h3 className="mb-0">Máy tính</h3>
      </div>
      
      <Container fluid>
        <Row xs={2} md={3} lg={6} className="g-3">
          {productItems.filter((product) => product.category[0] ===  "laptop")
          .map((product) => (
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
}

export default LaptopPage;