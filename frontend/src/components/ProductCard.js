import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Make sure to install react-icons

const ProductCard = ({ product, showProgress }) => {
  const {
    name,
    image,
    ram,
    ssd,
    price,
    originalPrice,
    installmentAmount,
    rating,
    soldCount,
    specs,
    remainingStock,
    totalStock
  } = product;
  //random discount percentage
  const discountPercentage = originalPrice ? 
    Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="product-card h-100 border-0">
      <div className="position-relative">
        {discountPercentage > 0 && (
          <div className="position-absolute end-0 top-0 bg-danger text-white px-2 py-1 m-2 rounded">
            -{discountPercentage}%
          </div>
        )}
        <div className="position-absolute start-0 top-0 m-2">
          <div className="text-muted small">Trả góp 0%</div>
        </div>
        <Card.Img 
          variant="top" 
          src={image} 
          className="p-3"
          style={{ objectFit: 'contain', height: '200px' }}
        />
      </div>
      <Card.Body className="d-flex flex-column p-2">
        <Card.Title className="fs-6 mb-2">{name}</Card.Title>
        {(ram || ssd) && (
          <div className="specs text-muted small mb-2">
            {ram && <span className="me-3">RAM {ram}</span>}
            {ssd && <span>SSD {ssd}</span>}
          </div>
        )}
        {specs && (
          <div className="additional-specs text-muted small mb-2">
            {specs}
          </div>
        )}
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
        {showProgress && remainingStock && totalStock && (
          <div className="stock-progress mb-2">
            <ProgressBar 
              now={(remainingStock / totalStock) * 100} 
              variant="warning" 
              className="mb-1"
            />
            <div className="text-danger small">
              Còn {remainingStock}/{totalStock} suất
            </div>
          </div>
        )}
        <div className="rating-sales mt-auto">
          {rating && (
            <span className="text-warning me-1">
              <FaStar className="me-1" size={12} />
              {rating}
            </span>
          )}
          {soldCount && (
            <span className="text-muted small">
              • Đã bán {soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k` : soldCount}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;