import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext.js';
import ProductCard from './ProductCard.js';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Pagination from './Pagination';
import axiosInstance from '../utils/axiosInstance.js';
const LaptopPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [laptopProducts, setlaptopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${backendUrl}/product`, {
          params: {
            category: 'laptop',
            limit : 16,
            brand: brand || undefined,
            priceRange: priceRange || undefined,
          }
        });
  
        setlaptopProducts(response.data.product || []);
        // setTotalPages(response.data.totalPages || 1); 
        console.log(response.data.product)
        setLoading(false);
      } catch (err) {
        console.error('Error fetching phones:', err);
        setError('Không có máy tính nào');
        setLoading(false);
      }
    };
  
    fetchLaptop();
  }, [backendUrl, brand, priceRange]);
  const brands = Array.from(new Set(laptopProducts.map((p) => p.brand).filter(Boolean)));

  const filteredProducts = laptopProducts.filter((product) => {
    const matchesBrand = !brand || product.brand === brand;
    let matchesPrice = true;
    if (priceRange === 'lt10') matchesPrice = product.price < 10000000;
    if (priceRange === '10to20') matchesPrice = product.price >= 10000000 && product.price <= 20000000;
    if (priceRange === 'gt20') matchesPrice = product.price > 20000000;
    return matchesBrand && matchesPrice;
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
          <h2 className="mb-3 mb-md-0 fw-bold text-primary">Máy tính xách tay</h2>
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
                <option value="lt10">Dưới 10 triệu</option>
                <option value="10to20">10 - 20 triệu</option>
                <option value="gt20">Trên 20 triệu</option>
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
          <Pagination pageName="productsPage" category='Laptop' brand={brand} setItems={setlaptopProducts}/>
        </div>
      </Container>
    </div>
  );
};

export default LaptopPage;
