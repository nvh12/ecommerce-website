import React, { useState, useEffect, useContext } from 'react';
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
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserRating();
        }
    }, [productId, isLoggedIn]);

    const fetchUserRating = async () => {
        try {
            const response = await axios.get(`${backendUrl}/rating/${productId}`, {
                withCredentials: true
            });
            
            // Check if response.data.ratings exists and is an array
            if (response.data && Array.isArray(response.data.ratings)) {
                // Find the current user's rating
                const userRating = response.data.ratings.find(r => r.fromUser);
                if (userRating) {
                    setRating(userRating.rate);
                    setUserRating(userRating);
                } else {
                    setRating(0);
                    setUserRating(null);
                }
            } else {
                setRating(0);
                setUserRating(null);
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
            toast.error('Failed to load your rating');
        }
    };
    
    const handleRatingSubmit = async (newRating) => {
        if (!isLoggedIn) {
            toast.error('Please login to rate this product');
            return;
        }

        if (newRating < 1 || newRating > 5) {
            toast.error('Rating must be between 1 and 5');
            return;
        }

        try {
            if (userRating) {
                // Update existing rating
                await axios.put(`${backendUrl}/rating/update/${userRating._id}`, {
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
            await fetchUserRating();
            
            toast.success('Rating submitted successfully');
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        }
    };

    const handleDeleteRating = async () => {
        if (!userRating) return;
        
        try {
            await axios.delete(`${backendUrl}/rating/delete/${userRating._id}`, {
                withCredentials: true
            });
            
            // Fetch fresh product data to update ratings
            await fetchProduct(productId);
            setRating(0);
            setUserRating(null);
            
            toast.success('Rating deleted successfully');
        } catch (error) {
            console.error('Error deleting rating:', error);
            toast.error(error.response?.data?.message || 'Failed to delete rating');
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
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Your Rating</h5>
                            {userRating && (
                                <button 
                                    className="btn btn-link text-danger p-0"
                                    onClick={handleDeleteRating}
                                >
                                    Delete Rating
                                </button>
                            )}
                        </div>
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