import React, { useState, useEffect, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import '../styles/Rating.css';

const Rating = ({ 
    productId,
    ratingsAvg, 
    ratingsCount, 
    isLoggedIn
}) => {
    const { backendUrl, user, fetchProduct } = useContext(AppContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ratingDistribution, setRatingDistribution] = useState([]);
    const [userHasRated, setUserHasRated] = useState(false);

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
            
            if (response.data && response.data.ratings) {
                const userRating = response.data.ratings.fromUser;
                if (userRating) {
                    setRating(response.data.ratings.rate);
                    setUserHasRated(true);
                } else {
                    setRating(0);
                    setUserHasRated(false);
                }
                setRatingDistribution(response.data.ratingDistribution || []);
            } else {
                setRating(0);
                setUserHasRated(false);
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
            }, { withCredentials: true });
            
            await fetchProduct(productId);
            await fetchUserRating();
            setUserHasRated(true);
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
                                                width: `${(ratingsCount[star] || 0) / (ratingsCount?.total || 1) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="count ms-2">
                                        {ratingsCount[star] || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isLoggedIn ? (
                        <div className="rating-form">
                            <h5 className="mb-3">
                                {userHasRated ? (
                                    <div className="user-rating-info">
                                        Đánh giá của bạn: {rating} <FaStar className="ms-1" />
                                    </div>
                                ) : (
                                    "Đánh giá của bạn"
                                )}
                            </h5>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`star ${
                                                        star <= (hover || rating) ? 'active' : ''
                                                    } ${userHasRated && star <= rating ? 'user-selected' : ''}`}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                />
                                            ))}
                                        </div>
                                    </div>
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
                                        userHasRated ? 'Cập nhật đánh giá' : 'Gửi đánh giá'
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