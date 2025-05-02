import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, ListGroup, Badge, Dropdown } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BsThreeDotsVertical, BsPencil, BsTrash } from 'react-icons/bs';
import axiosInstance from '../utils/axiosInstance';

// Custom dropdown toggle without the default caret
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: 'pointer' }}
  >
    {children}
  </div>
));

const ProductComments = ({ productId, onCommentAdded }) => {
    const { userData, backendUrl, isLoggedIn } = useContext(AppContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchComments();
    }, [productId]);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`${backendUrl}/comment/${productId}`, {
                withCredentials: true
            });
            
            if (response.data.message === "Success" && Array.isArray(response.data.commentProduct)) {
                setComments(response.data.commentProduct);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Không thể tải bình luận');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(
                `${backendUrl}/comment/create`,
                { 
                    productId,
                    comment: newComment 
                },
                { withCredentials: true }
            );

            if (response.data.message === 'Success') {
                toast.success('Đánh giá đã được thêm thành công');
                setNewComment('');
                
                // Create a new comment object with the current user's information
                const newCommentObj = {
                    ...response.data.newComment,
                    user: {
                        _id: userData._id,
                        name: userData.name
                    },
                    fromUser: true,
                    context: response.data.newComment.context || newComment // Ensure we have the comment text
                };
                
                // Add the new comment to the beginning of the list
                setComments(prevComments => [newCommentObj, ...prevComments]);
                if (onCommentAdded) {
                    onCommentAdded(newCommentObj);
                }
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(error.response?.data?.message || 'Không thể thêm đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (commentId) => {
        if (!editText.trim()) {
            setEditingComment(null);
            return;
        }

        try {
            const response = await axiosInstance.put(
                `${backendUrl}/comment/update/${commentId}`,
                { newComment: editText },
                { withCredentials: true }
            );

            if (response.data.message === 'Success') {
                // Update the comment in the local state
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment._id === commentId
                            ? { ...comment, context: editText }
                            : comment
                    )
                );
                
                toast.success('Đánh giá đã được cập nhật thành công');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error(error.response?.data?.message || 'Không thể cập nhật đánh giá');
        } finally {
            setEditingComment(null);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const response = await axiosInstance.delete(
                `${backendUrl}/comment/delete/${commentId}`,
                { withCredentials: true }
            );

            if (response.data.message === 'Success') {
                // Remove the comment from the local state
                setComments(prev => prev.filter(comment => comment._id !== commentId));
                if (onCommentAdded) {
                    onCommentAdded(null, commentId);
                }
                toast.success('Đánh giá đã được xóa thành công');
            } else {
                toast.error('Không thể xóa đánh giá');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error(error.response?.data?.message || 'Không thể xóa đánh giá');
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment._id);
        setEditText(comment.context);
    };

    const cancelEditing = () => {
        setEditingComment(null);
        setEditText('');
    };

    if (isLoading) {
        return (
            <Card className="mb-4">
                <Card.Body className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mb-0">Bình Luận ({comments.length})</h5>
            </Card.Header>
            <Card.Body>
                {isLoggedIn && userData?._id ? (
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Viết bình luận của bạn..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="mt-2"
                            disabled={isSubmitting || !newComment.trim()}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi Bình Luận'}
                        </Button>
                    </Form>
                ) : (
                    <div className="text-center p-3">
                        <p>Vui lòng <a href="/login">đăng nhập</a> để bình luận</p>
                    </div>
                )}

                <ListGroup variant="flush">
                    {comments.map((comment) => (
                        <ListGroup.Item key={comment._id}>
                            {editingComment === comment._id ? (
                                <div>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="mb-2"
                                    />
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            onClick={() => handleUpdate(comment._id)}
                                            disabled={!editText.trim()}
                                        >
                                            Lưu
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={cancelEditing}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="d-flex align-items-center mb-1">
                                            <h6 className="mb-0 me-2">{comment.user?.name || 'Người dùng ẩn danh'}</h6>
                                            {comment.fromUser && (
                                                <Badge bg="primary" className="ms-2">Bạn</Badge>
                                            )}
                                        </div>
                                        <p className="mb-1">{comment.context}</p>
                                        <small className="text-muted">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Vừa xong'}
                                        </small>
                                    </div>
                                    {(comment.fromUser || userData?._id === comment.user?._id) && (
                                        <div>
                                            <Dropdown align="end">
                                                <Dropdown.Toggle as={CustomToggle}>
                                                    <Button 
                                                        variant="link" 
                                                        className="text-dark p-0" 
                                                        style={{ backgroundColor: 'transparent', border: 'none' }}
                                                    >
                                                        <BsThreeDotsVertical />
                                                    </Button>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item 
                                                        onClick={() => startEditing(comment)}
                                                        className="d-flex align-items-center"
                                                    >
                                                        <BsPencil className="me-2" /> <span className="text-primary">Sửa</span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item 
                                                        onClick={() => handleDelete(comment._id)}
                                                        className="d-flex align-items-center"
                                                    >
                                                        <BsTrash className="me-2" /> <span className="text-danger">Xóa</span>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ListGroup.Item>
                    ))}
                    {comments.length === 0 && (
                        <ListGroup.Item className="text-center text-muted">
                            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default ProductComments;