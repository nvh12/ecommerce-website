import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { AppContext } from '../context/AppContext';
import axiosInstance from '../utils/axiosInstance';

const TabletPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTablets = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from a category-specific endpoint
        const response = await axiosInstance.get(`${backendUrl}/products?category=tablets`);
        setTablets(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tablets:', err);
        setError('Không có máy tính bảng nào');
        setLoading(false);
      }
    };

    fetchTablets();
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
      <h2 className="mb-4">Máy Tính Bảng</h2>
      <Row>
        {tablets.length > 0 ? (
          tablets.map(tablet => (
            <Col key={tablet._id} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={tablet} />
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Card className="text-center py-5">
              <Card.Body>
                <Card.Title>Không có máy tính bảng nào</Card.Title>
                <Card.Text>
                  Hiện tại chưa có máy tính bảng nào trong danh mục này.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TabletPage; 