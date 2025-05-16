import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';
import Pagination from './Pagination';
const SmartwatchPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [smartwatches, setSmartWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');

  
  useEffect(() => {
    const fetchSmartwatch = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${backendUrl}/product`, {
          params: {
            category: 'smartwatch',
            limit : 16,
            brand: brand || undefined,
            priceRange: priceRange || undefined,
          }
        });
  
        setSmartWatches(response.data.product || []);
        // setTotalPages(response.data.totalPages || 1); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching phones:', err);
        setError('Không có đồng hồ nào');
        setLoading(false);
      }
    };
  
    fetchSmartwatch();
  }, [backendUrl, brand, priceRange]);

  // Lấy danh sách brand duy nhất
  const brands = Array.from(new Set(smartwatches.map((p) => p.brand).filter(Boolean)));

  // Áp dụng filter
  const filteredProducts = smartwatches.filter((product) => {
    let matchesBrand = !brand || product.brand === brand;
    let matchesPrice = true;
    if (priceRange === 'lt5') matchesPrice = product.price < 5000000;
    if (priceRange === '5to10') matchesPrice = product.price >= 5000000 && product.price <= 10000000;
    if (priceRange === 'gt10') matchesPrice = product.price > 10000000;
    return matchesBrand && matchesPrice;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
          <h2 className="mb-3 mb-md-0 fw-bold text-primary">Đồng Hồ Thông Minh</h2>
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
            filteredProducts.map((smartwatch) => (
              <Col key={smartwatch._id}>
                <ProductCard product={smartwatch} />
              </Col>
            ))
          )}
        </Row>
        <div className="mt-4">
          <Pagination pageName="productsPage" category='smartwatch' brand={brand} setItems={setSmartWatches}/>
        </div>
      </Container>
    </div>
  );
};

export default SmartwatchPage;
