import React, { useState, useEffect, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Rating = ({ 
    productId,
    ratingsAvg, 
    ratingsCount, 
    isLoggedIn
}) => {
    const { backendUrl, user, fetchProduct } = useContext(AppContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ratingDistribution, setRatingDistribution] = useState([]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserRating();
        }
    }, [productId, isLoggedIn]);

    const fetchUserRating = async () => {
        try {
            const response = await axiosInstance.get(`${backendUrl}/rating/${productId}`, {
                withCredentials: true
            });
            
            if (response.data && Array.isArray(response.data.ratings)) {
                const userRating = response.data.ratings.find(r => r.fromUser);
                if (userRating) {
                    setRating(userRating.rate);
                    setComment(userRating.comment || '');
                } else {
                    setRating(0);
                    setComment('');
                }
                setRatingDistribution(response.data.ratingDistribution || []);
            } else {
                setRating(0);
                setComment('');
                setRatingDistribution([]);
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.post(`${backendUrl}/rating/create`, {
                productId,
                rate: rating,
                comment
            }, { withCredentials: true });
            
            await fetchProduct(productId);
            await fetchUserRating();
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-section mb-4">
            <Card>
                <Card.Body>
                    <h4 className="mb-4">Đánh Giá Sản Phẩm</h4>
                    <div className="rating-summary d-flex align-items-center mb-4">
                        <div className="rating-average text-center me-4">
                            <h2 className="mb-0">{ratingsAvg?.toFixed(1) || '0.0'}</h2>
                            <div className="stars">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={index < ratingsAvg ? 'text-warning' : 'text-muted'}
                                    />
                                ))}
                            </div>
                            <small className="text-muted">
                                ({ratingsCount?.total || 0} đánh giá)
                            </small>
                        </div>
                        <div className="rating-bars flex-grow-1">
                            {[5, 4, 3, 2, 1].map((star, index) => (
                                <div key={star} className="rating-bar-row d-flex align-items-center mb-1">
                                    <div className="stars me-2">
                                        {star} <FaStar className="text-warning ms-1" />
                                    </div>
                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                        <div
                                            className="progress-bar bg-warning"
                                            style={{
                                                width: `${(ratingDistribution[index] || 0) / (ratingsCount?.total || 1) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="count ms-2">
                                        {ratingDistribution[index] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <div className="rating-form">
                            <h5 className="mb-3">Viết đánh giá của bạn</h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <Form.Label className="me-3 mb-0">Chọn số sao:</Form.Label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`star ${
                                                        star <= (hover || rating) ? 'active' : ''
                                                    }`}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nhận xét của bạn:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting || !rating}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                className="me-2"
                                            />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        'Gửi đánh giá'
                                    )}
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            Vui lòng <Link to="/login">đăng nhập</Link> để viết đánh giá
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default Rating;