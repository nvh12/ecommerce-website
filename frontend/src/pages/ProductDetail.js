import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, isLoggedIn } = useContext(AppContext);
    
    // Get product data from location state
    const product = location.state?.product;
    const [selectedColor, setSelectedColor] = useState(product?.color?.[0] || null);
    const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || null);

    // If no product data in state, redirect to home
    if (!product) {
        navigate('/');
        return null;
    }

    const finalPrice = product.discount 
        ? product.price - (product.price * (product.discount / 100)) 
        : product.price;

    // Add to cart handler
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await axios.post(`${backendUrl}/cart/add`, {
                productId: product._id,
                price: product.price
            }, { withCredentials: true });
            
            toast.success("Đã thêm vào giỏ hàng");
        } catch (error) {
            toast.error("Lỗi thêm vào giỏ hàng");
        }
    };

    return (
        <Container className="py-4">
            <Row>
                {/* Left Column - Images */}
                <Col md={6} className="mb-4">
                    <div className="product-images">
                        <div className="main-image-container mb-3 border rounded p-3">
                            <img 
                                src={selectedImage} 
                                alt={product.productName}
                                className="img-fluid"
                                style={{ 
                                    maxHeight: '400px', 
                                    width: '100%', 
                                    objectFit: 'contain' 
                                }}
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="d-flex gap-2 flex-wrap">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                        className={`thumbnail-container border rounded p-1 ${selectedImage === image ? 'border-primary' : ''}`}
                                        style={{ cursor: 'pointer', width: '70px', height: '70px' }}
                                    >
                                        <img 
                                            src={image}
                                            alt={`${product.productName} ${index + 1}`}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Col>

                {/* Right Column - Product Info */}
                <Col md={6}>
                    <div className="product-info">
                        {/* Categories */}
                        <div className="mb-2">
                            {product.category.map((cat, index) => (
                                <Badge 
                                    key={index} 
                                    bg="light" 
                                    text="dark"
                                    className="me-2"
                                >
                                    {cat}
                                </Badge>
                            ))}
                        </div>

                        {/* Product Name */}
                        <h1 className="h3 mb-2">{product.productName}</h1>

                        {/* Brand */}
                        {product.brand && (
                            <div className="text-muted mb-3">{product.brand}</div>
                        )}

                        {/* Ratings */}
                        <div className="d-flex align-items-center mb-3">
                            {product.ratingsAvg > 0 && (
                                <span className="text-warning me-2">
                                    <FaStar className="me-1" />
                                    {product.ratingsAvg.toFixed(1)}
                                </span>
                            )}
                            {product.ratingsCount > 0 && (
                                <span className="text-muted">
                                    {product.ratingsCount} đánh giá
                                </span>
                            )}
                            {product.reviewsCount > 0 && (
                                <span className="text-muted ms-2">
                                    | {product.reviewsCount} nhận xét
                                </span>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="price-section p-3 bg-light rounded mb-3">
                            <div className="current-price text-danger fs-3 fw-bold">
                                {finalPrice.toLocaleString()}{product.currency}
                            </div>
                            {product.discount > 0 && (
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-decoration-line-through text-muted">
                                        {product.price.toLocaleString()}{product.currency}
                                    </span>
                                    <span className="text-danger">-{product.discount}%</span>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="stock-info mb-3">
                            <span className="fw-bold me-2">Tình trạng:</span>
                            <span className={product.stocks > 0 ? 'text-success' : 'text-danger'}>
                                {product.stocks > 0 ? `Còn hàng (${product.stocks})` : 'Hết hàng'}
                            </span>
                        </div>

                        {/* Colors */}
                        {product.color && product.color.length > 0 && (
                            <div className="colors-section mb-3">
                                <div className="fw-bold mb-2">Màu sắc</div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {product.color.map((color) => (
                                        <div
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`color-option p-2 border rounded ${
                                                selectedColor === color ? 'border-primary' : ''
                                            }`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="small">{color}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="features-section mb-3">
                                <div className="fw-bold mb-2">Tính năng nổi bật</div>
                                <ul className="list-unstyled">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="mb-2">
                                            • {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        <div className="description-section mb-4">
                            <div className="fw-bold mb-2">Mô tả sản phẩm</div>
                            <p className="text-muted">{product.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                            <Button 
                                variant="danger" 
                                size="lg"
                                disabled={product.stocks <= 0}
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart className="me-2" />
                                Thêm vào giỏ hàng
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                size="lg"
                                onClick={() => navigate('/')}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Rating 
                        productId={product._id} 
                        onRatingUpdate={() => {
                            // Optionally refresh product data if needed
                            // This would be needed if you want to update the average rating
                            // displayed in the product details
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail; 