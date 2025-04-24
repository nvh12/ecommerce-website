import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPage = () => {
    const { backendUrl, isLoggedIn, user } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        price: '',
        description: '',
        category: '',
        brand: '',
        stocks: '',
        color: '',
        images: []
    });
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProducts();
        fetchStats();
    }, [isLoggedIn, user, navigate]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/product/all`);
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/admin/stats`);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to fetch statistics');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${backendUrl}/product/create`, newProduct);
            toast.success('Product added successfully');
            setShowAddModal(false);
            setNewProduct({
                productName: '',
                price: '',
                description: '',
                category: '',
                brand: '',
                stocks: '',
                color: '',
                images: []
            });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${backendUrl}/product/update/${selectedProduct._id}`, selectedProduct);
            toast.success('Product updated successfully');
            setShowEditModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${backendUrl}/product/delete/${productId}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Admin Dashboard</h1>
            
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="products">Products</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="dashboard">
                        <Row>
                            <Col md={3}>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <Card.Title>Total Products</Card.Title>
                                        <Card.Text className="display-4">{stats.totalProducts}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <Card.Title>Total Orders</Card.Title>
                                        <Card.Text className="display-4">{stats.totalOrders}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <Card.Title>Total Users</Card.Title>
                                        <Card.Text className="display-4">{stats.totalUsers}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="mb-4">
                                    <Card.Body>
                                        <Card.Title>Total Revenue</Card.Title>
                                        <Card.Text className="display-4">${stats.totalRevenue}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="products">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Product Management</h2>
                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                Add New Product
                            </Button>
                        </div>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.productName}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.stocks}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Add Product Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddProduct}>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.productName}
                                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.brand}
                                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                value={newProduct.stocks}
                                onChange={(e) => setNewProduct({ ...newProduct, stocks: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.color}
                                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Product
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <Form onSubmit={handleEditProduct}>
                            <Form.Group className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.productName}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedProduct.price}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={selectedProduct.description}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.category}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.brand}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedProduct.stocks}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stocks: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.color}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update Product
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminPage; 