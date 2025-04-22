import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar } from 'react-icons/fa';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { productItems } = useContext(AppContext);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Get product directly from productItems
    const product = productItems.find(p => p._id === id);

    useEffect(() => {
        if (product) {
            // Set initial image
            if (product.images && product.images.length > 0) {
                setSelectedImage(product.images[0]);
            }
            // Set initial color
            if (product.color && product.color.length > 0) {
                setSelectedColor(product.color[0]);
            }
        }
    }, [product]);

    if (!product) {
        return (
            <Container className="py-5 text-center">
                <h2>Không tìm thấy sản phẩm</h2>
                <Button 
                    variant="primary" 
                    className="mt-3"
                    onClick={() => navigate('/')}
                >
                    Quay về trang chủ
                </Button>
            </Container>
        );
    }

    const finalPrice = product.discount 
        ? product.price - (product.price * (product.discount / 100)) 
        : product.price;

    return (
        <Container className="py-4">
            <Row>
                {/* Left Column - Images */}
                <Col md={6} className="mb-4">
                    <div className="product-images">
                        <div className="main-image-container mb-3 border rounded p-3">
                            <img 
                                src={selectedImage || product.images[0]} 
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

                        {/* Stock */}
                        <div className="stock-info mb-3">
                            <span className="fw-bold me-2">Kho:</span>
                            <span className={product.stocks > 0 ? 'text-success' : 'text-danger'}>
                                {product.stocks > 0 ? `${product.stocks} sản phẩm` : 'Hết hàng'}
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

                        {/* Categories */}
                        {product.category && product.category.length > 0 && (
                            <div className="categories-section mb-3">
                                <div className="fw-bold mb-2">Danh mục</div>
                                <div className="d-flex gap-2 flex-wrap">
                                    {product.category.map((cat, index) => (
                                        <span key={index} className="badge bg-light text-dark">
                                            {cat}
                                        </span>
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
                        {product.description && (
                            <div className="description-section mb-4">
                                <div className="fw-bold mb-2">Mô tả sản phẩm</div>
                                <p className="text-muted">{product.description}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                            <Button 
                                variant="danger" 
                                size="lg"
                                disabled={product.stocks <= 0}
                            >
                                MUA NGAY
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                size="lg"
                                disabled={product.stocks <= 0}
                            >
                                THÊM VÀO GIỎ HÀNG
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail; 