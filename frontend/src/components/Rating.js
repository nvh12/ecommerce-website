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

    // Fetch ratings
    useEffect(() => {
        fetchRatings();
    }, [productId]);

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/rating/${productId}`);
            setRatings(data.ratings || []);
            // Find user's rating if it exists
            const userRating = data.ratings?.find(r => r.fromUser);
            if (userRating) {
                setUserRating(userRating.rate);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            toast.error('Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async (rating) => {
        if (!isLoggedIn) {
            toast.error('Vui lòng đăng nhập để đánh giá');
            return;
        }

        try {
            const existingRating = ratings.find(r => r.fromUser);
            if (existingRating) {
                // Update existing rating
                await axios.put(
                    `${backendUrl}/rating/update/${existingRating._id}`,
                    { rate: rating },
                    { withCredentials: true }
                );
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
            }
            
            toast.success('Đánh giá thành công');
            await fetchRatings();
            if (onRatingUpdate) onRatingUpdate();
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Không thể gửi đánh giá');
        }
    };

    const handleRatingDelete = async (ratingId) => {
        try {
            await axios.delete(
                `${backendUrl}/rating/delete/${ratingId}`,
                { withCredentials: true }
            );
            toast.success('Đã xóa đánh giá');
            await fetchRatings();
            if (onRatingUpdate) onRatingUpdate();
        } catch (error) {
            console.error('Error deleting rating:', error);
            toast.error('Không thể xóa đánh giá');
        }
    };

    const StarRating = ({ value, onHover, onClick, size = 24 }) => {
        return (
            <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={size}
                        style={{ cursor: 'pointer', marginRight: '4px' }}
                        color={star <= (hoveredRating || value) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => onHover(star)}
                        onMouseLeave={() => onHover(0)}
                        onClick={() => onClick(star)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return <div>Đang tải đánh giá...</div>;
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
                        />
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