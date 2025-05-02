import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Carousel, Row, Col } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';

const SalesCarousel = () => {
  const { productItems } = useContext(AppContext);
  
  // Group products into sets of 6 for each carousel slide
  const groupProducts = (products, size) => {
    return products.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(products.slice(i, i + size));
      return acc;
    }, []);
  };

  return (
    <div className="sales-section mb-4">
      <div className="sales-header bg-light p-3 d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h3 className="mb-0 text-danger me-4">KHUYẾN MÃI HOT</h3>
        </div>
        <div>
          <span className="text-muted">Sắp diễn ra 21:00 - 21:10</span>
        </div>
      </div>

      <Carousel 
        controls={true} 
        indicators={false}
        interval={null}
        className="sales-carousel"
      >
        {groupProducts(productItems.filter(p => p.onSale), 6).map((group, idx) => (
          <Carousel.Item key={idx}>
            <Row className="g-3">
              {group.map((product) => (
                <Col key={product._id} xs={6} md={4} lg={2}>
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
                      discount: product.discount,
                      remainingStock: product.remainingStock,
                      totalStock: product.totalStock
                    }}
                    showProgress={true}
                  />
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default SalesCarousel;