import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Make sure to install react-icons
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, showProgress }) => {
  const navigate = useNavigate();
  const {
    _id,
    productName,
    images,
    price,
    currency,
    discount,
    ratingsAvg,
    ratingsCount,
    brand,
    ram,
    ssd, 
    originalPrice,
    installmentAmount,
    rating,
    soldCount,
    specs,
    remainingStock,
    totalStock
  } = product;
  console.log("Product:", product);
  //random discount percentage
  // const discountPercentage = originalPrice ? 
  //   Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const discountPercentage = 10;

  const handleClick = () => {
    navigate(`/product/${_id}`);
  };

  // Calculate discounted price if there's a discount
  const finalPrice = discount ? price - (price * (discount / 100)) : price;

  return (
    <Card 
      className="product-card h-100 border-0 shadow-sm" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="position-relative">
        {discount > 0 && (
          <div className="position-absolute end-0 top-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
            -{discount}%
          </div>
        )}
        <div className="position-absolute start-0 top-0 m-2">
          <div className="text-muted small">Trả góp 0%</div>
        </div>
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
      <Card.Body className="d-flex flex-column p-3">
        <div className="mb-2">
          {brand && (
            <div className="text-muted small mb-1">{brand}</div>
          )}
          <Card.Title className="product-name fs-6 mb-0">
            {productName}
          </Card.Title>
        </div>
        {/* {(ram || ssd) && (
          <div className="specs text-muted small mb-2">
            {ram && <span className="me-3">RAM {ram}</span>}
            {ssd && <span>SSD {ssd}</span>}
          </div>
        )} */}
        {/* {specs && (
          <div className="additional-specs text-muted small mb-2">
            {specs}
          </div>
        )} */}
        <div className="mt-auto">
          <div className="price-section mb-2">
            <div className="current-price text-danger fw-bold">
              {finalPrice.toLocaleString()}{currency}
            </div>
            {discount > 0 && (
              <div className="original-price text-muted text-decoration-line-through small">
                {price.toLocaleString()}{currency}
              </div>
            )}
          </div>
          {/* {installmentAmount && (
            <div className="installment text-warning small mb-2">
              Quà {installmentAmount.toLocaleString()}₫
            </div>
          )} */}
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
          {(ratingsAvg > 0 || ratingsCount > 0) && (
            <div className="ratings-section">
              <div className="d-flex align-items-center">
                {ratingsAvg > 0 && (
                  <span className="text-warning d-flex align-items-center me-1">
                    <FaStar size={12} className="me-1" />
                    {ratingsAvg.toFixed(1)}
                  </span>
                )}
                {ratingsCount > 0 && (
                  <span className="text-muted small">
                    ({ratingsCount})
                  </span>
                )}
              </div>
            </div>
          )}
          {soldCount && (
            <div className="text-muted small">
              • Đã bán {soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k` : soldCount}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;