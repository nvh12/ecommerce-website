import React from 'react';
import { Button } from 'react-bootstrap';

const ProductInfo = ({ product, selectedColor, onColorChange }) => {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="product-info">
      <h1 className="h3 mb-3">{product.name}</h1>
      
      <div className="price-section mb-4">
        <div className="current-price text-danger fs-3 fw-bold">
          {product.price.toLocaleString()}₫
        </div>
        {product.originalPrice && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-decoration-line-through text-muted">
              {product.originalPrice.toLocaleString()}₫
            </span>
            <span className="text-danger">-{discountPercentage}%</span>
          </div>
        )}
      </div>

      <div className="color-section mb-4">
        <div className="fw-bold mb-2">Màu sắc</div>
        <div className="d-flex gap-2">
          {product.colors.map((color) => (
            <div
              key={color.name}
              onClick={() => onColorChange(color)}
              className={`color-option p-2 border rounded ${
                selectedColor.name === color.name ? 'border-primary' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="color-circle mb-1"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: color.code,
                  border: color.code === '#FFFFFF' ? '1px solid #ddd' : 'none'
                }}
              />
              <div className="small">{color.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="highlights-section mb-4">
        <div className="fw-bold mb-2">Điểm nổi bật</div>
        <ul className="list-unstyled">
          {product.highlights.map((highlight, index) => (
            <li key={index} className="mb-2">
              • {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="action-buttons d-grid gap-2">
        <Button variant="danger" size="lg">
          MUA NGAY
        </Button>
        <Button variant="outline-primary" size="lg">
          THÊM VÀO GIỎ HÀNG
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo; 