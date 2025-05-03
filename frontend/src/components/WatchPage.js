import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';

const WatchPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from a category-specific endpoint
        const response = await axiosInstance.get(`${backendUrl}/products?category=watches`);
        setWatches(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching watches:', err);
        setError('Không có đồng hồ nào');
        setLoading(false);
      }
    };

    fetchWatches();
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
      <h2 className="mb-4">Đồng Hồ</h2>
      <Row>
        {watches.length > 0 ? (
          watches.map(watch => (
            <Col key={watch._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={watch} />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Card className="text-center py-5">
              <Card.Body>
                <Card.Title>Không có đồng hồ nào</Card.Title>
                <Card.Text>
                  Hiện tại chưa có đồng hồ nào trong danh mục này.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default WatchPage; 