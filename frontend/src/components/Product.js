import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Button, Spinner } from 'react-bootstrap';

const Product = ({
    _id,
    productName,
    images,
    price,
    discountedPrice,
    discount,
    ratingsAvg,
    ratingsQuantity,
    stocks,
    isLoggedIn,
    handleAddToCart,
    isAddingToCart
}) => {
    const navigate = useNavigate();

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={images[0]}
                    alt={productName}
                    className="product-image"
                    onClick={() => navigate(`/product/${_id}`)}
                />
                {discount > 0 && (
                    <div className="discount-badge">
                        -{discount}%
                    </div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name" onClick={() => navigate(`/product/${_id}`)}>
                    {productName}
                </h3>
                <div className="product-price">
                    <span className="current-price">
                        {discountedPrice.toLocaleString('vi-VN')} VND
                    </span>
                    {discount > 0 && (
                        <span className="original-price">
                            {price.toLocaleString('vi-VN')} VND
                        </span>
                    )}
                </div>
                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                color={index < ratingsAvg ? "#ffc107" : "#e4e5e9"}
                                size={16}
                            />
                        ))}
                    </div>
                    <span className="rating-count">
                        ({ratingsQuantity || 0} đánh giá)
                    </span>
                </div>
                <div className="product-stock">
                    {stocks > 0 ? (
                        <span className="in-stock">Còn hàng ({stocks})</span>
                    ) : (
                        <span className="out-of-stock">Hết hàng</span>
                    )}
                </div>
                <div className="product-actions">
                    <Button
                        variant="outline-primary"
                        className="view-details-btn"
                        onClick={() => navigate(`/product/${_id}`)}
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        variant="primary"
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={!isLoggedIn || stocks === 0 || isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <><FaShoppingCart /> Thêm vào giỏ</>
                        )}
                    </Button>
                </div>
                {!isLoggedIn && (
                    <small className="login-reminder">
                        Vui lòng <Link to="/login">đăng nhập</Link> để mua hàng
                    </small>
                )}
            </div>
        </div>
    );
};

export default Product;