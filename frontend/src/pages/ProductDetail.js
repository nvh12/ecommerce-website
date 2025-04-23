import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, isLoggedIn } = useContext(AppContext);
    
    // Get product data from location state
    const [product, setProduct] = useState(location.state?.product);
    const [selectedColor, setSelectedColor] = useState(product?.color?.[0] || null);
    const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || null);

    // Rating state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [isLoadingRatings, setIsLoadingRatings] = useState(false);

    // If no product data in state, fetch it
    useEffect(() => {
        if (!product) {
            fetchProduct();
        }
        fetchRatings();
    }, [id]);

    const fetchRatings = async () => {
        setIsLoadingRatings(true);
        try {
            const { data } = await axios.get(`${backendUrl}/rating/${id}`);
            setRatings(data.ratings);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            toast.error('Không thể tải đánh giá');
        } finally {
            setIsLoadingRatings(false);
        }
    };

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/product/${id}`);
            setProduct(data.product);
            setSelectedColor(data.product?.color?.[0] || null);
            setSelectedImage(data.product?.images?.[0] || null);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Không thể tải thông tin sản phẩm');
            navigate('/');
        }
    };

    // Rating handlers
    const handleRatingSubmit = async (newRating) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để đánh giá');
            return;
        }
        try {
            await axios.post(`${backendUrl}/rating/${id}`, { rate: newRating });
            setRating(newRating);
            fetchRatings(); // Refresh ratings
            toast.success('Đã gửi đánh giá');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Không thể gửi đánh giá');
        }
    };

    const handleRatingDelete = async (ratingId) => {
        try {
            await axios.delete(`${backendUrl}/rating/${ratingId}`);
            setRatings(ratings.filter(r => r.id !== ratingId));
            toast.success('Đã xóa đánh giá');
        } catch (error) {
            console.error('Error deleting rating:', error);
            toast.error('Không thể xóa đánh giá');
        }
    };

    const StarRating = ({ value, onHover, onClick, size = 24, interactive = true }) => {
        return (
            <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={size}
                        style={{ 
                            cursor: interactive ? 'pointer' : 'default',
                            marginRight: '4px',
                            transition: 'color 0.2s ease'
                        }}
                        color={star <= (hoverRating || value) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => interactive && onHover(star)}
                        onMouseLeave={() => interactive && onHover(0)}
                        onClick={() => interactive && onClick(star)}
                    />
                ))}
            </div>
        );
    };

    // If no product data, show loading
    if (!product) {
        return <div>Đang tải...</div>;
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
                id: product._id,
                price: product.price
            }, { withCredentials: true });
            
            toast.success("Đã thêm vào giỏ hàng");
        } catch (error) {
            toast.error("Lỗi thêm vào giỏ hàng");
        }
    };

    // Calculate rating statistics
    const getRatingStats = () => {
        const total = Array.isArray(ratings) ? ratings.length : 0;
        const stats = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };
        
        if (Array.isArray(ratings)) {
            ratings.forEach(rating => {
                stats[rating.rate]++;
            });
        }

        return Object.keys(stats).map(rate => ({
            rate: parseInt(rate),
            count: stats[rate],
            percentage: total ? (stats[rate] / total * 100).toFixed(1) : 0
        })).reverse();
    };

    const averageRating = Array.isArray(ratings) && ratings.length > 0 
        ? (ratings.reduce((acc, curr) => acc + curr.rate, 0) / ratings.length).toFixed(1)
        : '0';

    return (
        <div>
            <Header />
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

                            {/* Demo Ratings */}
                        <div className="d-flex align-items-center mb-3">
                                <span className="text-warning me-2">
                                    <FaStar className="me-1" />
                                    {ratings.length > 0 
                                        ? (ratings.reduce((acc, curr) => acc + curr.rate, 0) / ratings.length).toFixed(1)
                                        : '0.0'}
                                </span>
                                <span className="text-muted">
                                    {ratings.length} đánh giá
                                </span>
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

                {/* Rating Section */}
                <Row className="mt-4">
                    <Col>
                        <div className="ratings-section">
                            <h4 className="mb-4">Đánh giá {product.productName}</h4>
                            
            <Row>
                                <Col md={4} className="text-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <div className="h1 mb-0" style={{ color: '#F8C146' }}>
                                            {averageRating}
                                            <span className="h3">/5</span>
                                        </div>
                                        <div className="mb-2">
                                            <StarRating
                                                value={parseFloat(averageRating)}
                                                onHover={() => {}}
                                                onClick={() => {}}
                                                size={20}
                                                interactive={false}
                                            />
                                        </div>
                                        <div className="text-muted">
                                            {ratings.length} đánh giá
                                        </div>
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <div className="rating-bars">
                                        {getRatingStats().map(stat => (
                                            <div key={stat.rate} className="d-flex align-items-center mb-2">
                                                <div style={{ width: '60px' }} className="text-end me-2">
                                                    {stat.rate} <FaStar style={{ color: '#F8C146' }} size={14} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="progress" style={{ height: '8px' }}>
                                                        <div
                                                            className="progress-bar"
                                                            role="progressbar"
                                                            style={{ 
                                                                width: `${stat.percentage}%`,
                                                                backgroundColor: '#F8C146'
                                                            }}
                                                            aria-valuenow={stat.percentage}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ width: '60px' }} className="text-start ms-2">
                                                    {stat.percentage}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>

                            {/* Rating Input */}
                            {isLoggedIn && (
                                <Card className="my-4 p-3 border-0 bg-light">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">Đánh giá của bạn:</div>
                                        <StarRating
                                            value={rating}
                                            onHover={setHoverRating}
                                            onClick={handleRatingSubmit}
                                            size={24}
                                        />
                                    </div>
                                </Card>
                            )}

                            {/* Ratings List */}
                            <div className="ratings-list mt-4">
                                {Array.isArray(ratings) && ratings.map((rating) => (
                                    <div key={rating.id} className="mb-4">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-2">
                                                    <StarRating
                                                        value={rating.rate}
                                                        onHover={() => {}}
                                                        onClick={() => {}}
                                                        size={16}
                                                        interactive={false}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <strong>{rating.user.name}</strong>
                                                </div>
                                                <p className="mb-2">{rating.comment}</p>
                                                <div className="d-flex align-items-center">
                                                    {isLoggedIn && rating.fromUser && (
                                                        <button 
                                                            className="btn btn-link btn-sm text-danger p-0"
                                                            onClick={() => handleRatingDelete(rating.id)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {Array.isArray(ratings) && ratings.length > 2 && (
                                <div className="text-center mt-4">
                                    <Button variant="outline-primary">
                                        Xem {ratings.length} đánh giá
                                    </Button>
                                </div>
                            )}
                        </div>
                </Col>
            </Row>
        </Container>
        <Footer />
        </div>
    );
};

export default ProductDetail; 