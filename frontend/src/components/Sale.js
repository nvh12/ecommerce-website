import React, { useContext, useEffect, useState } from 'react';
import ProductCard from './ProductCard.js';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/SaleCarousel.css';
import { AppContext } from '../context/AppContext.js';

const Sale = () => {
  const { backendUrl } = useContext(AppContext);
  const [discountedProducts, setDiscountedProducts] = useState([]);

  // Fetch sản phẩm giảm giá khi component được mount
  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        // const url=${backendUrl}/product/?order=discount&dir=desc;
        const response = await fetch(`${backendUrl}/product/?order=discount&dir=desc&limit=24`);
        const data = await response.json();
        setDiscountedProducts(data.product || []); // Giả sử response có key `products`
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm giảm giá:", error);
      }
    };

    fetchDiscountedProducts();
  }, [backendUrl]);

  // Gom nhóm sản phẩm thành từng nhóm 6 sản phẩm
  const groupProducts = (products, size) => {
    return products.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(products.slice(i, i + size));
      return acc;
    }, []);
  };

  const productGroups = groupProducts(discountedProducts, 6);

  // Icon điều hướng
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

      {discountedProducts.length > 0 ? (
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
                      <ProductCard product={product} showProgress={false} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-muted">Đang tải sản phẩm giảm giá...</p>
      )}
    </div>
  );
};

export default Sale;
