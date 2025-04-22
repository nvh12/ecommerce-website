import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';

const ProductGrid = ({ category, brand, priceRange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/product/?`;
        
        if (category) url += `category=${category}&`;
        if (brand) url += `brand=${brand}&`;
        if (priceRange) {
          if (priceRange.min) url += `priceMin=${priceRange.min}&`;
          if (priceRange.max) url += `priceMax=${priceRange.max}&`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.message === "Success") {
          setProducts(data.product);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category, brand, priceRange]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row xs={2} md={3} lg={6} className="g-3">
        {products.map((product) => (
          <Col key={product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid; 