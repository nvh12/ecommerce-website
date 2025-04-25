import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import CartItem from '../components/CartItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
    const { backendUrl, isLoggedIn } = useContext(AppContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutInfo, setCheckoutInfo] = useState({
        payment: 'cash',
        delivery: 'store',
        address: '',
        userId: ''
    });
    const [showQRCoe, setShowQRCoe] = useState(false);

    const navigate = useNavigate();

    // Fetch cart items
    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/cart`, { withCredentials: true });
            // console.log(data.data.items);
            setCartItems(data.data.items || []);
            // toast.success("Giỏ hàng đã được tải thành công");
            // console.log("cart", cartItems);
            setLoading(false);
        } catch (error) {
            // toast.error("Lỗi lấy thông tin giỏ hàng");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [isLoggedIn, navigate]);

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Handle quantity changes
    const handleQuantityChange = async (productId, action) => {
        try {
            let endpoint = '';
            if (action === 'increase') {
                endpoint = '/cart/add';
            } else if (action === 'decrease') {
                endpoint = '/cart/reduce';
            } else if (action === 'remove') {
                endpoint = '/cart/remove';
            }

            await axios.post(`${backendUrl}${endpoint}`, {
                id: productId,
                price: cartItems.find(item => item.product._id === productId)?.price
            }, { withCredentials: true });

            fetchCart(); // Refresh cart after update
            // toast.success("Giỏ hàng đã được cập nhật");
        } catch (error) {
            toast.error("Lỗi cập nhật giỏ hàng");
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        try {
            if (checkoutInfo.delivery === 'delivery' && !checkoutInfo.address) {
                toast.error("Vui lòng nhập địa chỉ giao hàng");
                return;
            }
            // console.log("payment", checkoutInfo.payment)
            const res = await axios.get(`${backendUrl}/user/`, { withCredentials: true });
            const userId = res.data.data._id;
    
            const finalCheckoutInfo = {
                ...checkoutInfo,
                userId
            };
            
            // console.log("checkoutInfo gửi đi:", finalCheckoutInfo);
            if(finalCheckoutInfo.payment === 'cash') {
                await axios.post(`${backendUrl}/cart/checkout`, {
                    ...finalCheckoutInfo,
                }, {
                    withCredentials: true
                });
                toast.success("Đặt hàng thành công!");
                navigate('/user');
            } else {
                setShowQRCoe(true)
            }
        } catch (error) {
            toast.error("Lỗi đặt hàng");
            const message = error.response?.data?.message || error.response?.data?.error;
            console.error("Chi tiết lỗi:", message);
        }
    };

    const handleCheckoutQr = async () => {
        try {
            const res = await axios.get(`${backendUrl}/user/`, { withCredentials: true });
            const userId = res.data.data._id;
            const finalCheckoutInfo = {
                ...checkoutInfo,
                userId
            };
            // console.log("checkoutInfo gửi đi:", finalCheckoutInfo);
            await axios.post(`${backendUrl}/cart/checkout`, {
                ...finalCheckoutInfo,
            }, {
                withCredentials: true
            });
    
            toast.success("Thanh toán thành công");
            navigate('/user');
        } catch (error) {
            toast.error("Lỗi thanh toán");
            const message = error.response?.data?.message || error.response?.data?.error;
            console.error("Chi tiết lỗi:", message);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <Container className="py-5 text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            {showQRCoe && 
            <>
                <div className="position-fixed w-100 h-100 bg-dark bg-opacity-25 backdrop-blur d-flex justify-content-center align-items-center"
                style={{ zIndex: 9999 }}>
                    <div className="shadow rounded position-relative bg-white">
                        <div className='d-flex justify-content-end mb-2 p-1'>
                            <button className='btn'
                            onClick={() => setShowQRCoe(false)}>
                                <i className="bi bi-x-lg text-end"></i>
                            </button>
                        </div>
                        <div className='p-5'>
                            <div style={{height: "200px", width: "200px"}}>
                            <img src="/images/static-qr-code.jpg" alt="Ảnh QR" 
                            className="h-100 w-100"/>
                            </div>
                            <p className="my-2 text-center">Quét mã QR để thanh toán</p>
                            <div className="d-flex justify-content-center align-items-center">
                            <button className="btn rounded-pill hover-style py-1 px-2"
                            style={{backgroundColor: "#FFD400"}}
                            onClick={handleCheckoutQr}
                            >
                                Xác nhận
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
            <Header />
            <Container className="py-5">
                <h1 className="mb-4">Giỏ hàng</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <h3>Giỏ hàng trống</h3>
                        <Button 
                            variant="primary" 
                            className="mt-3"
                            onClick={() => navigate('/')}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                ) : (
                    <Row>
                        {/* Cart Items */}
                        <Col md={8}>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <CartItem 
                                        key={item.product._id}
                                        item={item}
                                        onIncrease={() => handleQuantityChange(item.product._id, 'increase')}
                                        onDecrease={() => handleQuantityChange(item.product._id, 'decrease')}
                                        onRemove={() => handleQuantityChange(item.product._id, 'remove')}
                                    />
                                ))}
                            </div>
                        </Col>

                        {/* Checkout Section */}
                        <Col md={4}>
                            <div className="checkout-section bg-light p-4 rounded">
                                <h4 className="mb-3">Thông tin đặt hàng</h4>
                                
                                {/* Payment Method */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Phương thức thanh toán</Form.Label>
                                    <Form.Select 
                                        value={checkoutInfo.payment}
                                        onChange={(e) => setCheckoutInfo({
                                            ...checkoutInfo,
                                            payment: e.target.value
                                        })}
                                    >
                                        <option value="cash">Tiền mặt</option>
                                        <option value="QR">QR Code</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Delivery Method */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Phương thức nhận hàng</Form.Label>
                                    <Form.Select 
                                        value={checkoutInfo.delivery}
                                        onChange={(e) => setCheckoutInfo({
                                            ...checkoutInfo,
                                            delivery: e.target.value
                                        })}
                                    >
                                        <option value="store">Nhận tại cửa hàng</option>
                                        <option value="delivery">Giao hàng tận nơi</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Address (for delivery) */}
                                {checkoutInfo.delivery === 'delivery' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Địa chỉ giao hàng</Form.Label>
                                        <Form.Control 
                                            as="textarea" 
                                            rows={3}
                                            value={checkoutInfo.address}
                                            onChange={(e) => setCheckoutInfo({
                                                ...checkoutInfo,
                                                address: e.target.value
                                            })}
                                            placeholder="Nhập địa chỉ giao hàng"
                                        />
                                    </Form.Group>
                                )}

                                {/* Total and Checkout Button */}
                                <div className="total-section mt-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tạm tính:</span>
                                        <span>{total.toLocaleString()}₫</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Phí vận chuyển:</span>
                                        <span>{checkoutInfo.delivery === 'delivery' ? '30,000₫' : '0₫'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4 fw-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-danger fs-5">
                                            {(total + (checkoutInfo.delivery === 'delivery' ? 30000 : 0)).toLocaleString()}₫
                                        </span>
                                    </div>
                                    <Button 
                                        variant="danger" 
                                        className="w-100"
                                        onClick={handleCheckout}
                                    >
                                        Đặt hàng
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container> 
            <Footer />
        </>
    );
};

export default CartPage; 