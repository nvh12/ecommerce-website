import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const   CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <Card className="mb-3 cart-item">
            <Card.Body>
                <div className="d-flex">
                    {/* Product Image */}
                    <div className="cart-item-image me-3">
                        <img 
                            src={item.product.images[0]} 
                            alt={item.product.productName}
                            style={{ 
                                width: '100px', 
                                height: '100px', 
                                objectFit: 'contain' 
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="cart-item-info flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 className="mb-1">{item.product.productName}</h5>
                                {item.product.brand && (
                                    <div className="text-muted small mb-2">{item.product.brand}</div>
                                )}
                            </div>
                            <Button 
                                variant="link" 
                                className="text-danger p-0"
                                onClick={onRemove}
                            >
                                <FaTrash />
                            </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="d-flex justify-content-between align-items-end mt-2">
                            <div className="price-section">
                                <div className="text-danger fw-bold">
                                    {item.price.toLocaleString()}₫
                                </div>
                                {item.product.discount > 0 && (
                                    <div className="text-muted text-decoration-line-through small">
                                        {(item.price / (1 - item.product.discount/100)).toLocaleString()}₫
                                    </div>
                                )}
                            </div>

                            <div className="quantity-controls d-flex align-items-center">
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onDecrease}
                                    disabled={item.quantity <= 1}
                                >
                                    <FaMinus size={12} />
                                </Button>
                                {
                                    item.quantity > item.product.stocks ? 
                                    <span className="mx-3">{item.product.stocks}</span>
                                    :
                                    <span className="mx-3">{item.quantity}</span>
                                }
                                <Button 
                                    variant="outline-secondary" 
                                    size="sm"
                                    onClick={onIncrease}
                                    disabled={item.quantity === item.product.stocks}
                                >
                                    <FaPlus size={12} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CartItem; 