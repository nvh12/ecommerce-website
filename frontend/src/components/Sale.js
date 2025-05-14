import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from './ProductCard.js';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/SaleCarousel.css';

const Sale = () => {
  const { productItems } = useContext(AppContext);
  console.log(productItems);
  // Filter products with discount greater than 0
  const discountedProducts = productItems.filter(product => product.discount > 0);
  console.log(discountedProducts);
  // Group products into sets of 6 for each carousel slide
  const groupProducts = (products, size) => {
    return products.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(products.slice(i, i + size));
      return acc;
    }, []);
  };

  const productGroups = groupProducts(discountedProducts, 6);

  // Custom prev/next icons for carousel
  const CustomPrevIcon = <FaChevronLeft className="carousel-custom-icon" />;
  const CustomNextIcon = <FaChevronRight className="carousel-custom-icon" />;

  return (
    <div className="sales-section mb-4">
      <div className="section-header p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0 text-danger">Giảm Giá Sốc</h3>
        <div className="sale-badge bg-danger text-white px-3 py-1 rounded-pill">
          Ưu Đãi Nóng
        </div>
      </div>
      
      <Carousel 
        controls={true}
        indicators={true}
        interval={5000}
        className="sale-carousel"
        prevIcon={CustomPrevIcon}
        nextIcon={CustomNextIcon}
      >
        {productGroups.map((group, idx) => (
          <Carousel.Item key={idx}>
            <Container fluid>
              <Row xs={2} md={3} lg={6} className="g-3">
                {group.map((product) => (
                  <Col key={product._id}>
                    <ProductCard 
                      product={product}
                      showProgress={false}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Sale;