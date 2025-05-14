import React, { useState, useContext, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductComments from '../components/ProductComments';
import Rating from '../components/Rating';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        backendUrl,
        isLoggedIn,
        user,
        product,
        isLoadingProduct,
        productError,
        fetchProduct
    } = useContext(AppContext);

    // Initialize state with null values
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const currentIdRef = useRef(id);

    // Fetch product when component mounts or id changes
    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id, fetchProduct]);

    // Update selected color and image when product is loaded
    useEffect(() => {
        if (product) {
            setSelectedColor(product.color?.[0] || null);
            setSelectedImage(product.images?.[0] || null);
        }
    }, [product]);

    // Show loading state
    if (isLoadingProduct) {
        return (
            <div>
                <Header />
                <Container className="py-4">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </Container>
                <Footer />
            </div>
        );
    }

    // Show error state
    if (productError) {
        return (
            <div>
                <Header />
                <Container className="py-4">
                    <div className="alert alert-danger">
                        {productError}
                    </div>
                </Container>
                <Footer />
            </div>
        );
    }

    // Show not found state
    if (!product) {
        return (
            <div>
                <Header />
                <Container className="py-4">
                    <div className="alert alert-warning">
                        Product not found
                    </div>
                </Container>
                <Footer />
            </div>
        );
    }

    // Calculate final price with proper checks
    const calculateFinalPrice = () => {
        if (!product || typeof product.price !== 'number') return 0;
        if (product.discount) {
            return product.price - (product.price * (product.discount / 100));
        }
        return product.price;
    };

    const finalPrice = calculateFinalPrice();

    // Add to cart handler
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            await axiosInstance.post(`${backendUrl}/cart/add`, {
                id: product._id,
                price: product.price
            }, { withCredentials: true });

            toast.success("Đã thêm vào giỏ hàng");
        } catch (error) {
            toast.error("Không thể thêm vào giỏ hàng");
        }
    };

    return (
        <div>
            <Header />
            <Navbar />
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
                            {product.images?.length > 1 && (
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
                                {product.category?.map((cat, index) => (
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

                            {/* Stock Status */}
                            <div className="stock-info mb-3">
                                <span className="fw-bold me-2">Kho:</span>
                                <span className={product.stocks > 0 ? 'text-success' : 'text-danger'}>
                                    {product.stocks > 0 ? `Còn hàng (${product.stocks})` : 'Hết hàng'}
                                </span>
                            </div>

                            {/* Colors */}
                            {product.color?.length > 0 && (
                                <div className="colors-section mb-3">
                                    <div className="fw-bold mb-2">Màu sắc</div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {product.color.map((item, index) => {
                                              const name = item.split(":", 1)[0];
                                              const image = item.substring(item.indexOf(":") + 1).trim();
                                            const isSelected = selectedColor === name.trim();

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedColor(name.trim())}
                                                    className={`border rounded p-2 d-flex align-items-center cursor-pointer ${isSelected ? 'border-danger border-2' : 'border-secondary'
                                                        }`}
                                                    style={{ minWidth: '120px', position: 'relative', cursor: 'pointer' }}
                                                >
                                                    <img src={image.trim()} alt={name.trim()} width={32} height={32} className="me-2" />
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{name.trim()}</div>
                                                        {/* <div>29.990.000₫</div> nếu cần giá thì thêm sau */}
                                                    </div>

                                                    {/* Icon chọn ✔ */}
                                                    {isSelected && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '-8px',
                                                                right: '-8px',
                                                                background: 'red',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: '20px',
                                                                height: '20px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '14px',
                                                            }}
                                                        >
                                                            ✓
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-4">
                                <h4>Mô tả sản phẩm</h4>
                                <p>{product.description}</p>
                            </div>

                            {/* Price Section */}
                            <div className="price-section p-3 bg-light rounded mb-3">
                                <div className="current-price text-danger fs-3 fw-bold">
                                    {typeof finalPrice === 'number' ? finalPrice.toLocaleString() : '0'}{product?.currency || '$'}
                                </div>
                                {product?.discount > 0 && (
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-decoration-line-through text-muted">
                                            {typeof product.price === 'number' ? product.price.toLocaleString() : '0'}{product?.currency || '$'}
                                        </span>
                                        <span className="text-danger">-{product.discount}%</span>
                                    </div>
                                )}
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

                {/* Specifications Table from features array */}
                
                    <div className="mb-4">
                        <h4>Thông số kỹ thuật</h4>
                        {product.features && product.features.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    {product.features.map((item, index) => {
                                        const [label, value] = item.split(":");
                                        return (
                                            <tr key={index}>
                                                <th style={{ width: '30%' }}>{label.trim()}</th>
                                                <td>{value ? value.trim() : ''}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        ):(
                            <p>Đang cập nhật</p>
                        )}
                    </div>



                {/* Rating Section */}
                <Row className="mt-4">
                    <Col md={12}>
                        <Rating
                            productId={product._id}
                            ratingsAvg={product.ratingsAvg}
                            ratingsCount={product.ratingsCount}
                            isLoggedIn={isLoggedIn}
                        />
                    </Col>
                </Row>

                {/* Comments Section */}
                <Row className="mt-4">
                    <Col md={12}>
                        <ProductComments
                            productId={product._id}
                            onCommentAdded={() => { }}
                        />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProductDetail; 