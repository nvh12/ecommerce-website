import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    
    if (!product) return null;

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
        stocks
    } = product;

    const finalPrice = discount ? price - (price * (discount / 100)) : price;

    const handleClick = () => {
        navigate(`/product/${_id}`, { state: { product } });
    };

    return (
        <Card 
            className="product-card h-100 border-0 shadow-sm" 
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="position-relative">
                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="position-absolute end-0 top-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                        -{discount}%
                    </div>
                )}
                
                {/* Stock Status */}
                {stocks <= 0 && (
                    <div className="position-absolute start-0 top-0 bg-dark text-white px-2 py-1 m-2 rounded-pill">
                        Hết hàng
                    </div>
                )}

                {/* Product Image */}
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
                {/* Brand */}
                {brand && (
                    <div className="text-muted small mb-1">{brand}</div>
                )}

                {/* Product Name */}
                <Card.Title className="product-name fs-6 mb-2">
                    {productName}
                </Card.Title>

                {/* Price Section */}
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

                    {/* Ratings */}
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
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductCard;