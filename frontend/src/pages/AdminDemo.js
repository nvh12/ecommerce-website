import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tab, Nav, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AdminDemo = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [brandFilter, setBrandFilter] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    
    // Mock products data
    const [products, setProducts] = useState([
        {
            _id: '1',
            productName: 'iPhone 13 Pro',
            price: 999,
            category: 'Phone',
            stocks: 50,
            brand: 'Apple',
            color: 'Graphite'
        },
        {
            _id: '2',
            productName: 'MacBook Pro M1',
            price: 1299,
            category: 'Laptop',
            stocks: 30,
            brand: 'Apple',
            color: 'Space Gray'
        },
        {
            _id: '3',
            productName: 'Samsung Galaxy S21',
            price: 799,
            category: 'Phone',
            stocks: 45,
            brand: 'Samsung',
            color: 'Phantom Black'
        }
    ]);

    // Mock users data
    const [users, setUsers] = useState([
        {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active'
        },
        {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            status: 'active'
        },
        {
            _id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'user',
            status: 'inactive'
        }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newProduct, setNewProduct] = useState({
        productName: '',
        price: '',
        description: '',
        category: '',
        brand: '',
        stocks: '',
        color: ''
    });
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
    });

    // Mock statistics
    const stats = {
        totalProducts: 3,
        totalOrders: 15,
        totalUsers: 8,
        totalRevenue: 25000
    };

    // Filter products based on search term and filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        const matchesBrand = brandFilter === 'All' || product.brand === brandFilter;
        const matchesPrice = priceRange === 'All' || 
                           (priceRange === 'Under $500' && product.price < 500) ||
                           (priceRange === '$500-$1000' && product.price >= 500 && product.price <= 1000) ||
                           (priceRange === 'Over $1000' && product.price > 1000);
        
        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    const handleAddProduct = (e) => {
        e.preventDefault();
        const newId = (products.length + 1).toString();
        const productToAdd = {
            ...newProduct,
            _id: newId
        };
        setProducts([...products, productToAdd]);
        setShowAddModal(false);
        setNewProduct({
            productName: '',
            price: '',
            description: '',
            category: '',
            brand: '',
            stocks: '',
            color: ''
        });
        toast.success('Product added successfully (Demo)');
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        setProducts(products.map(p => 
            p._id === selectedProduct._id ? selectedProduct : p
        ));
        setShowEditModal(false);
        toast.success('Product updated successfully (Demo)');
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p._id !== productId));
            toast.success('Product deleted successfully (Demo)');
        }
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        const newId = (users.length + 1).toString();
        const userToAdd = {
            ...newUser,
            _id: newId
        };
        setUsers([...users, userToAdd]);
        setShowAddUserModal(false);
        setNewUser({
            name: '',
            email: '',
            role: 'user',
            status: 'active'
        });
        toast.success('User added successfully (Demo)');
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        setUsers(users.map(u => 
            u._id === selectedUser._id ? selectedUser : u
        ));
        setShowEditUserModal(false);
        toast.success('User updated successfully (Demo)');
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u._id !== userId));
            toast.success('User deleted successfully (Demo)');
        }
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">Admin Demo Dashboard</h1>
            
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="products">Products</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="users">Users</Nav.Link>
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
                            <h2>Product Management (Demo)</h2>
                            <Button variant="primary" onClick={() => setShowAddModal(true)}>
                                Add New Product
                            </Button>
                        </div>

                        {/* Search and Filter Bar */}
                        <Row className="mb-4">
                            <Col md={4}>
                                <InputGroup>
                                    <FormControl
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="All">All Categories</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Laptop">Laptop</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                                    <option value="All">All Brands</option>
                                    <option value="Apple">Apple</option>
                                    <option value="Samsung">Samsung</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                                    <option value="All">All Prices</option>
                                    <option value="Under $500">Under $500</option>
                                    <option value="$500-$1000">$500-$1000</option>
                                    <option value="Over $1000">Over $1000</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.productName}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
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

                    <Tab.Pane eventKey="users">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>User Management (Demo)</h2>
                            <Button variant="primary" onClick={() => setShowAddUserModal(true)}>
                                Add New User
                            </Button>
                        </div>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowEditUserModal(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user._id)}
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
                    <Modal.Title>Add New Product (Demo)</Modal.Title>
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
                    <Modal.Title>Edit Product (Demo)</Modal.Title>
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

            {/* Add User Modal */}
            <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User (Demo)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddUser}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add User
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={showEditUserModal} onHide={() => setShowEditUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User (Demo)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form onSubmit={handleEditUser}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUser.name}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={selectedUser.status}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update User
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDemo; 