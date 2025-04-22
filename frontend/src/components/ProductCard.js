import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const {
    _id,
    productName,
    images,
    price,
    currency,
    discount,
    ratingsAvg,
    ratingsCount,
    reviewsCount
  } = product;

  const discountedPrice = price - (price * (discount / 100));

  return (
    <Card className="product-card h-100 border-0">
      <Link to={`/product/${_id}`} className="text-decoration-none">
        <div className="position-relative">
          {discount > 0 && (
            <div className="position-absolute end-0 top-0 bg-danger text-white px-2 py-1 m-2 rounded">
              -{discount}%
            </div>
          )}
          <Card.Img 
            variant="top" 
            src={images[0]} 
            className="p-3"
            style={{ 
              height: '200px',
              objectFit: 'contain'
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column p-2">
          <Card.Title className="fs-6 mb-2 text-dark">
            {productName}
          </Card.Title>
          
          <div className="price-section mb-2">
            <div className="current-price text-danger fw-bold">
              {discountedPrice.toLocaleString()}{currency}
            </div>
            {discount > 0 && (
              <div className="original-price text-muted text-decoration-line-through small">
                {price.toLocaleString()}{currency}
              </div>
            )}
          </div>

          <div className="rating-reviews mt-auto">
            {ratingsAvg > 0 && (
              <span className="text-warning me-2">
                <FaStar className="me-1" size={12} />
                {ratingsAvg.toFixed(1)}
              </span>
            )}
            {ratingsCount > 0 && (
              <span className="text-muted small">
                ({ratingsCount} đánh giá)
              </span>
            )}
            {reviewsCount > 0 && (
              <span className="text-muted small ms-2">
                • {reviewsCount} đánh giá
              </span>
            )}
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default ProductCard;