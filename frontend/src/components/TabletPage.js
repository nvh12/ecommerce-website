import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.js';
import ProductCard from './ProductCard.js';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Pagination from './Pagination';
import axiosInstance from '../utils/axiosInstance';

const TabletPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [tabletProducts, setTabletProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const fetchTablets = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${backendUrl}/product`, {
          params: {
            category: 'Tablet',
            limit: 16,
            brand: brand || undefined,
            priceRange: priceRange || undefined,
          }
        });
        setTabletProducts(response.data.product || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tablets", err);
        setError("Không có máy tính bảng nào");
        setLoading(false);
      }
    };
    fetchTablets();
  }, [backendUrl, brand, priceRange]);

  const brands = Array.from(new Set(tabletProducts.map((p) => p.brand).filter(Boolean)));

  const filteredProducts = tabletProducts.filter((product) => {
    const matchesBrand = !brand || product.brand === brand;
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
          <h2 className="mb-3 mb-md-0 fw-bold text-primary">Máy tính bảng</h2>
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
        <Row xs={2} md={3} lg={4} className="g-4">
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
        <div className="mt-4">
          <Pagination pageName="productsPage" category='tablet' brand={brand} setItems={setTabletProducts} />
        </div>
      </Container>
    </div>
  );
};

export default TabletPage;
