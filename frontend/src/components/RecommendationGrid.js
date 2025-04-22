import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const RecommendationGrid = () => {
  const { productItems } = useContext(AppContext);

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
                product={{
                  name: product.name,
                  image: product.image,
                  ram: product.specifications?.ram,
                  ssd: product.specifications?.storage,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  installmentAmount: product.installmentAmount,
                  rating: product.rating,
                  soldCount: product.soldCount,
                  specs: product.specs // Additional specs like "TFT LCD 8.7""
                }}
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