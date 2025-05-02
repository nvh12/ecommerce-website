import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard.js';
import { Container, Row, Col } from 'react-bootstrap';

const Sale = () => {
  const { productItems } = useContext(AppContext);
  
  // Filter products with discount greater than 0
  const discountedProducts = productItems.filter(product => product.discount > 0);

  return (
    <div className="sales-section mb-4">
      <div className="section-header p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0 text-danger">Giảm Giá Sốc</h3>
        <div className="sale-badge bg-danger text-white px-3 py-1 rounded-pill">
          Ưu Đãi Nóng
        </div>
      </div>
      
      <Container fluid>
        <Row xs={2} md={3} lg={6} className="g-3">
          {discountedProducts.map((product) => (
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

export default Sale;