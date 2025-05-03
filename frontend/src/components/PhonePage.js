import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext.js';
import ProductCard from './ProductCard.js';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from './Header';
import NavbarComponent from './Navbar';
import Pagination from './Pagination';

const PhonePage = () => {
  const { productItems } = useContext(AppContext);
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Extract unique brands from phone products
  const phoneProducts = productItems.filter(
    (product) => product.category[0]?.toLowerCase() === 'điện thoại' || product.category[0]?.toLowerCase() === 'phone'
  );
  const brands = Array.from(new Set(phoneProducts.map((p) => p.brand).filter(Boolean)));

  // Filter logic
  const filteredProducts = phoneProducts.filter((product) => {
    let matchesBrand = !brand || product.brand === brand;
    let matchesPrice = true;
    if (priceRange === 'lt5') matchesPrice = product.price < 5000000;
    if (priceRange === '5to10') matchesPrice = product.price >= 5000000 && product.price <= 10000000;
    if (priceRange === 'gt10') matchesPrice = product.price > 10000000;
    return matchesBrand && matchesPrice;
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      <Container className="py-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
          <h2 className="mb-3 mb-md-0 fw-bold text-primary">Điện thoại thông minh</h2>
          <Form className="d-flex gap-3 flex-wrap">
            <Form.Group controlId="brandSelect">
              <Form.Select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="">Tất cả hãng</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="priceSelect">
              <Form.Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                style={{ minWidth: 150 }}
              >
                <option value="">Tất cả giá</option>
                <option value="lt5">Dưới 5 triệu</option>
                <option value="5to10">5 - 10 triệu</option>
                <option value="gt10">Trên 10 triệu</option>
              </Form.Select>
            </Form.Group>
            {(brand || priceRange) && (
              <Button variant="outline-secondary" onClick={() => { setBrand(''); setPriceRange(''); }}>
                Xóa lọc
              </Button>
            )}
          </Form>
        </div>
        <Row xs={2} md={3} lg={5} className="g-4">
          {filteredProducts.length === 0 ? (
            <Col xs={12} className="text-center text-muted py-5">
              Không có sản phẩm phù hợp.
            </Col>
          ) : (
            filteredProducts.map((product) => (
              <Col key={product._id}>
                <ProductCard product={product} showProgress={false} />
              </Col>
            ))
          )}
        </Row>
        
        {/* Add Pagination component */}
        <Pagination pageName="phonePage" />
      </Container>
    </div>
  );
};

export default PhonePage;