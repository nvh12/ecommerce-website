import React from 'react';
import { Card } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Make sure to install react-icons

const ProductCard = ({ product }) => {
  const {
    name,
    image,
    ram,
    ssd,
    price,
    originalPrice,
    installmentAmount,
    rating,
    soldCount
  } = product;
  //random discount percentage
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <Card className="product-card h-100 border-0">
      <div className="position-relative">
        {discountPercentage > 0 && (
          <div className="position-absolute end-0 top-0 bg-danger text-white px-2 py-1 m-2 rounded">
            -{discountPercentage}%
          </div>
        )}
        <Card.Img 
          variant="top" 
          src={image} 
          className="p-3"
          style={{ objectFit: 'contain', height: '200px' }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6 mb-2">{name}</Card.Title>
        <div className="specs text-muted mb-2">
          <span className="me-3">RAM {ram}</span>
          <span>SSD {ssd}</span>
        </div>
        <div className="price-section mb-2">
          <div className="current-price text-danger fw-bold">
            {price.toLocaleString()}₫
          </div>
          {originalPrice && (
            <div className="original-price text-muted text-decoration-line-through small">
              {originalPrice.toLocaleString()}₫
            </div>
          )}
        </div>
        {installmentAmount && (
          <div className="installment text-warning small mb-2">
            Quà {installmentAmount.toLocaleString()}₫
          </div>
        )}
        <div className="rating-sales mt-auto">
          <span className="text-warning me-1">
            <FaStar className="me-1" />
            {rating}
          </span>
          <span className="text-muted small">
            • Đã bán {soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k` : soldCount}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;