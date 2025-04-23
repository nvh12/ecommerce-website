import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Rating = ({ productId, onRatingUpdate }) => {
    const { backendUrl, isLoggedIn, user } = useContext(AppContext);
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Validate productId
    const isValidProductId = (id) => {
        return id && typeof id === 'string' && id.length === 24;
    };

    // Fetch ratings
    useEffect(() => {
        if (isValidProductId(productId)) {
            fetchRatings();
        } else {
            setError('ID sản phẩm không hợp lệ');
            setLoading(false);
        }
    }, [productId]);

    const fetchRatings = async () => {
        if (!isValidProductId(productId)) {
            setError('ID sản phẩm không hợp lệ');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${backendUrl}/rating/${productId}`);
            
            if (data.ratings) {
                setRatings(data.ratings);
                // Find user's rating if it exists
                const userRating = data.ratings.find(r => r.fromUser);
                if (userRating) {
                    setUserRating(userRating.rate);
                } else {
                    setUserRating(0);
                }
            } else {
                setRatings([]);
                setUserRating(0);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            const errorMessage = error.response?.data?.message || 'Không thể tải đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async (rating) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để đánh giá');
            return;
        }

        if (!isValidProductId(productId)) {
            toast.error('ID sản phẩm không hợp lệ');
            return;
        }

        if (submitting) return;
        setSubmitting(true);
        setError(null);

        try {
            const existingRating = ratings.find(r => r.fromUser);
            if (existingRating) {
                // Update existing rating
                await axios.put(
                    `${backendUrl}/rating/update/${existingRating._id}`,
                    { rate: rating },
                    { withCredentials: true }
                );
                toast.success('Đã cập nhật đánh giá');
            } else {
                // Create new rating
                await axios.post(
                    `${backendUrl}/rating/create`,
                    {
                        productId,
                        rate: rating,
                    },
                    { withCredentials: true }
                );
                toast.success('Đã gửi đánh giá');
            }
            
            await fetchRatings();
            if (onRatingUpdate) {
                await onRatingUpdate();
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            const errorMessage = error.response?.data?.message || 'Không thể gửi đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingDelete = async (ratingId) => {
        if (!ratingId || !isValidProductId(productId)) {
            toast.error('Không tìm thấy đánh giá');
            return;
        }

        if (submitting) return;
        setSubmitting(true);
        setError(null);

        try {
            await axios.delete(
                `${backendUrl}/rating/delete/${ratingId}`,
                { withCredentials: true }
            );
            toast.success('Đã xóa đánh giá');
            await fetchRatings();
            if (onRatingUpdate) {
                await onRatingUpdate();
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
            const errorMessage = error.response?.data?.message || 'Không thể xóa đánh giá';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
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
                        color={star <= (hoveredRating || value) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => interactive && onHover(star)}
                        onMouseLeave={() => interactive && onHover(0)}
                        onClick={() => interactive && onClick(star)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="ratings-section my-4">
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ratings-section my-4">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="ratings-section my-4">
            <h4 className="mb-3">Đánh giá sản phẩm</h4>
            
            {/* Rating Input */}
            {isLoggedIn && (
                <Card className="mb-4 p-3">
                    <div className="d-flex align-items-center">
                        <div className="me-3">Đánh giá của bạn:</div>
                        <StarRating
                            value={userRating}
                            onHover={setHoveredRating}
                            onClick={handleRatingSubmit}
                            interactive={!submitting}
                        />
                        {submitting && (
                            <div className="ms-2">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Ratings List */}
            <div className="ratings-list">
                {ratings.length > 0 ? (
                    ratings.map((rating) => (
                        <Card key={rating._id} className="mb-2">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col>
                                        <div className="d-flex align-items-center">
                                            <StarRating
                                                value={rating.rate}
                                                onHover={() => {}}
                                                onClick={() => {}}
                                                size={16}
                                                interactive={false}
                                            />
                                            <span className="ms-2 text-muted">
                                                {new Date(rating.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {rating.user && (
                                            <div className="text-muted mt-1">
                                                Bởi: {rating.user.name || 'Người dùng'}
                                            </div>
                                        )}
                                    </Col>
                                    {rating.fromUser && (
                                        <Col xs="auto">
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRatingDelete(rating._id)}
                                                disabled={submitting}
                                            >
                                                Xóa
                                            </Button>
                                        </Col>
                                    )}
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted">Chưa có đánh giá nào.</p>
                )}
            </div>
        </div>
    );
};

export default Rating; 