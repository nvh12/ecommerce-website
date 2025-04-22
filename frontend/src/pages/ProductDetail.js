import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSpecifications from '../components/ProductSpecifications';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductDetail } = useContext(AppContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/product/${id}`);
        const data = await response.json();
        
        if (data.message === "Success") {
          setProduct(data.product);
          if (data.product.color && data.product.color.length > 0) {
            setSelectedColor(data.product.color[0]);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/');
      }
      setLoading(false);
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Không tìm thấy sản phẩm</h2>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <ProductImageGallery images={product.images} />
        </Col>
        <Col md={6}>
          <ProductInfo 
            product={{
              name: product.productName,
              price: product.price,
              currency: product.currency,
              discount: product.discount,
              colors: product.color.map(color => ({ name: color, code: color })),
              description: product.description,
              features: product.features,
              ratingsAvg: product.ratingsAvg,
              ratingsCount: product.ratingsCount,
              reviewsCount: product.reviewsCount
            }}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </Col>
      </Row>
      {product.features && product.features.length > 0 && (
        <Row className="mt-4">
          <Col>
            <div className="specifications-section bg-light p-4 rounded">
              <h3 className="h5 mb-3">Đặc điểm nổi bật</h3>
              <ul className="list-unstyled">
                {product.features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail; 