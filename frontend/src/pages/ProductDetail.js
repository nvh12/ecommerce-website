import React, { useState, useContext, useEffect, useCallback } from 'react';
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
    const { backendUrl, isLoggedIn, user } = useContext(AppContext);
    
    // Get product data from location state
    const [product, setProduct] = useState(location.state?.product);
    const [selectedColor, setSelectedColor] = useState(product?.color?.[0] || null);
    const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || null);

    // Rating state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [isLoadingRatings, setIsLoadingRatings] = useState(false);
    const [lastRatingUpdate, setLastRatingUpdate] = useState(0);
    const [ratingStats, setRatingStats] = useState({
        average: 0,
        count: 0,
        distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }
    });
    const RATING_UPDATE_INTERVAL = 30000; // 30 seconds

    const fetchProduct = useCallback(async () => {
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
    }, [id, backendUrl, navigate]);

    const fetchRatings = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/rating/${id}`);
            setRatings(data.ratings);
            
            // Calculate and update average rating
            if (data.ratings && data.ratings.length > 0) {
                const avgRating = data.ratings.reduce((acc, curr) => acc + curr.rate, 0) / data.ratings.length;
                setRating(avgRating);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            toast.error('Failed to fetch ratings');
        }
    }, [id, backendUrl]);

    // Update rating stats whenever ratings change
    useEffect(() => {
        setRatingStats(calculateRatingStats(ratings));
    }, [ratings]);

    // Fetch product and ratings on component mount
    useEffect(() => {
        if (!product) {
            fetchProduct();
        }
        fetchRatings();
    }, [id, product, fetchProduct, fetchRatings]);

    // Fetch ratings periodically
    useEffect(() => {
        const fetchRatingsPeriodically = () => {
            const now = Date.now();
            if (now - lastRatingUpdate >= RATING_UPDATE_INTERVAL) {
                fetchRatings();
                setLastRatingUpdate(now);
            }
        };

        // Initial fetch
        fetchRatings();

        // Set up interval for periodic updates
        const intervalId = setInterval(fetchRatingsPeriodically, RATING_UPDATE_INTERVAL);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [id, lastRatingUpdate, fetchRatings]);

    // Rating handlers
    const handleRatingSubmit = async (newRating) => {
        if (!isLoggedIn) {
            toast.error('Please login to rate this product');
            return;
        }
        try {
            // Check if user has already rated this product
            const existingRating = ratings.find(r => r.userId === user._id);
            
            if (existingRating) {
                // Update existing rating
                await axios.put(`${backendUrl}/rating/update/${existingRating._id}`, {
                    rate: newRating
                }, { withCredentials: true });
            } else {
                // Create new rating
                await axios.post(`${backendUrl}/rating/create`, {
                    productId: id,
                    rate: newRating
                }, { withCredentials: true });
            }
            
            // Immediately update local state
            setRating(newRating);
            
            // Fetch fresh product data to update ratingsAvg and ratingsCount
            const { data: productData } = await axios.get(`${backendUrl}/product/${id}`);
            setProduct(productData.product);
            
            // Fetch fresh ratings from server
            await fetchRatings();
            
            toast.success('Rating submitted successfully');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating');
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

    const calculateRatingStats = (ratings) => {
        if (!ratings || ratings.length === 0) {
            return {
                average: 0,
                count: 0,
                distribution: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0
                }
            };
        }

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let total = 0;

        ratings.forEach(rating => {
            distribution[rating.rate]++;
            total += rating.rate;
        });

        return {
            average: (total / ratings.length).toFixed(1),
            count: ratings.length,
            distribution
        };
    };

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
                                    {product.ratingsAvg.toFixed(1)}
                                </span>
                                <span className="text-muted">
                                    {product.ratingsCount.total} đánh giá
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
                    <Col md={12}>
                        <Card className="mb-4">
                            <Card.Body>
                                <h3>Product Ratings</h3>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="me-3">
                                        <h2 className="mb-0">{product.ratingsAvg.toFixed(1)}</h2>
                                        <div className="text-muted">
                                            {product.ratingsCount.total} {product.ratingsCount.total === 1 ? 'rating' : 'ratings'}
                                        </div>
                                    </div>
                                    <div>
                                        <StarRating
                                            value={product.ratingsAvg}
                                            onHover={() => {}}
                                            onClick={() => {}}
                                            size={24}
                                            interactive={false}
                                        />
                                    </div>
                                </div>

                                {/* Rating Distribution */}
                                <div className="mt-3">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="d-flex align-items-center mb-2">
                                            <div className="me-2" style={{ width: '30px' }}>
                                                {star} <FaStar style={{ color: '#F8C146' }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="progress" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${(product.ratingsCount[star] / product.ratingsCount.total) * 100}%`,
                                                            backgroundColor: '#F8C146'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="ms-2" style={{ width: '40px' }}>
                                                {product.ratingsCount[star]}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Rating Input (if user is logged in) */}
                                {isLoggedIn && (
                                    <div className="mt-4">
                                        <h5>Your Rating</h5>
                                        <StarRating
                                            value={rating}
                                            onHover={setHoverRating}
                                            onClick={handleRatingSubmit}
                                            size={24}
                                        />
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
        </Container>
        <Footer />
        </div>
    );
};

export default ProductDetail; 