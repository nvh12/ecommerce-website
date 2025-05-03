import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';

const SmartwatchPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [smartwatches, setSmartWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSmartWatches = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from a category-specific endpoint
        const response = await axiosInstance.get(`${backendUrl}/products?category=smartwatches`);
        setSmartWatches(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching smartwatches:', err);
        setError('Không có đồng hồ thông minh nào');
        setLoading(false);
      }
    };

    fetchSmartWatches();
  }, [backendUrl]);

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
    <Container>
      <h2 className="mb-4">Đồng Hồ Thông Minh</h2>
      <Row>
        {smartwatches.length > 0 ? (
          smartwatches.map(smartwatch => (
            <Col key={smartwatch._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={smartwatch} />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Card className="text-center py-5">
              <Card.Body>
                <Card.Title>Không có đồng hồ thông minh nào</Card.Title>
                <Card.Text>
                  Hiện tại chưa có đồng hồ thông minh nào trong danh mục này.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SmartwatchPage; 