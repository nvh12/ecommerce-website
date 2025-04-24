import React, { useState, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Rating = ({ 
    productId,
    ratingsAvg, 
    ratingsCount, 
    isLoggedIn
}) => {
    const { backendUrl, user, fetchProduct } = useContext(AppContext);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleRatingSubmit = async (newRating) => {
        if (!isLoggedIn) {
            toast.error('Please login to rate this product');
            return;
        }

        try {
            // Check if user has already rated this product
            const existingRating = ratingsCount?.ratings?.find(r => r.userId === user._id);
            
            if (existingRating) {
                // Update existing rating
                await axios.put(`${backendUrl}/rating/update/${existingRating._id}`, {
                    rate: newRating
                }, { withCredentials: true });
            } else {
                // Create new rating
                await axios.post(`${backendUrl}/rating/create`, {
                    productId,
                    rate: newRating
                }, { withCredentials: true });
            }
            
            // Fetch fresh product data to update ratings
            await fetchProduct(productId);
            
            toast.success('Rating submitted successfully');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating');
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

    return (
        <Card className="mb-4">
            <Card.Body>
                <h3>Product Ratings</h3>
                <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                        <h2 className="mb-0">{ratingsAvg?.toFixed(1) || '0.0'}</h2>
                        <div className="text-muted">
                            {ratingsCount?.total || 0} {ratingsCount?.total === 1 ? 'rating' : 'ratings'}
                        </div>
                    </div>
                    <div>
                        <StarRating
                            value={ratingsAvg || 0}
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
                                            width: `${(ratingsCount?.[star] || 0) / (ratingsCount?.total || 1) * 100}%`,
                                            backgroundColor: '#F8C146'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="ms-2" style={{ width: '40px' }}>
                                {ratingsCount?.[star] || 0}
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
                            onClick={(newRating) => {
                                setRating(newRating);
                                handleRatingSubmit(newRating);
                            }}
                            size={24}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Rating; 