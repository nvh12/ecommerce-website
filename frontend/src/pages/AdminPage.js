import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
// Dashboard Component
const Dashboard = ({ stats }) => {
  return (
    <Row className="mt-4">
      <Col md={3}>
        <Card className="mb-4 shadow-sm">
          <Card.Body className="text-center">
            <Card.Title>Total Products</Card.Title>
            <Card.Text className="display-4">{stats.totalProducts}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 shadow-sm">
          <Card.Body className="text-center">
            <Card.Title>Total Orders</Card.Title>
            <Card.Text className="display-4">{stats.totalOrders}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 shadow-sm">
          <Card.Body className="text-center">
            <Card.Title>Total Users</Card.Title>
            <Card.Text className="display-4">{stats.totalUsers}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4 shadow-sm">
          <Card.Body className="text-center">
            <Card.Title>Total Revenue</Card.Title>
            <Card.Text className="display-4">${stats.totalRevenue}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// UserList Component
const UserList = ({ backendUrl }) => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      const { data } = await axiosInstance.get(`${backendUrl}/admin/user`, config);
      setUsers(data.user || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      await axiosInstance.put(`${backendUrl}/admin/user/${selectedUser._id}`, selectedUser, config);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true
        };
        await axiosInstance.delete(`${backendUrl}/admin/user/${userId}`, config);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowEditModal(true);
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

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleEditUser}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

// ProductList Component
const ProductList = ({ backendUrl }) => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    price: '',
    description: '',
    category: [],
    brand: '',
    stocks: '',
    color: [],
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      const { data } = await axios.get(`${backendUrl}/product`, config);
      setProducts(data.product || []);
      console.log(data.product);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data
      const productData = {
        productName: newProduct.productName,
        price: Number(newProduct.price),
        description: newProduct.description,
        category: typeof newProduct.category === 'string' 
          ? newProduct.category.split(',').map(cat => cat.trim()) 
          : newProduct.category,
        brand: newProduct.brand,
        stocks: Number(newProduct.stocks),
        color: typeof newProduct.color === 'string'
          ? newProduct.color.split(',').map(col => col.trim())
          : newProduct.color,
        images: Array.isArray(newProduct.images) 
          ? newProduct.images 
          : [newProduct.images].filter(Boolean),
        currency: 'USD'
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };
      
      await axiosInstance.post(`${backendUrl}/product/create`, productData, config);
      toast.success('Product added successfully');
      setShowAddModal(false);
      setNewProduct({
        productName: '',
        price: '',
        description: '',
        category: [],
        brand: '',
        stocks: '',
        color: [],
        images: []
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(`Failed to add product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data
      const productData = {
        productName: selectedProduct.productName,
        price: Number(selectedProduct.price),
        description: selectedProduct.description,
        category: typeof selectedProduct.category === 'string' 
          ? selectedProduct.category.split(',').map(cat => cat.trim()) 
          : selectedProduct.category,
        brand: selectedProduct.brand,
        stocks: Number(selectedProduct.stocks),
        color: typeof selectedProduct.color === 'string'
          ? selectedProduct.color.split(',').map(col => col.trim())
          : selectedProduct.color,
        images: Array.isArray(selectedProduct.images) 
          ? selectedProduct.images 
          : [selectedProduct.images].filter(Boolean),
        currency: 'USD'
      };

      console.log('Sending product data:', productData);

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };
      console.log(selectedProduct._id)
      await axios.put(`${backendUrl}/product/${selectedProduct._id}`, productData, config);
      toast.success('Product updated successfully');
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true
        };
        await axiosInstance.delete(`${backendUrl}/product/delete/${productId}`, config);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(`Failed to delete product: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const prepareProductForEdit = (product) => {
    return {
      ...product,
      category: Array.isArray(product.category) ? product.category.join(', ') : product.category,
      color: Array.isArray(product.color) ? product.color.join(', ') : product.color
    };
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add New Product
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
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
              <td>{Array.isArray(product.category) ? product.category.join(', ') : product.category}</td>
              <td>{product.stocks}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedProduct(prepareProductForEdit(product));
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

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.stocks}
                    onChange={(e) => setNewProduct({ ...newProduct, stocks: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Categories (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                placeholder="Electronics, Gadgets, ..."
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Colors (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.color}
                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                placeholder="Red, Blue, ..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.images}
                onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form onSubmit={handleEditProduct}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct.productName}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedProduct.brand}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedProduct.stocks}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, stocks: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Categories (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.category}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Colors (comma separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct.color}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

const AdminPage = () => {
  const { backendUrl, isLoggedIn, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // if (!isLoggedIn || user?.role !== 'admin') {
    //   navigate('/');
    //   return;
    // }
    fetchStats();
  }, [isLoggedIn, user, navigate]);

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      
      const productsRes = await axios.get(`${backendUrl}/product`, config);
      const usersRes = await axiosInstance.get(`${backendUrl}/admin/user`, config);
      const ordersRes = await axiosInstance.get(`${backendUrl}/admin/order`, config);
      
      // Calculate total revenue from orders
      const orders = ordersRes.data.data || [];
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      setStats({
        totalProducts: productsRes.data.product?.length || 0,
        totalOrders: orders.length,
        totalUsers: usersRes.data.user?.length || 0,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    }
  };

  return (
    <Container fluid className="admin-page-container py-4">
      <h1 className="mb-4 text-center">Admin Dashboard</h1>
      <Row>
        <Tab.Container id="admin-tabs" activeKey={activeKey} onSelect={setActiveKey}>
          <Row>
            <Col md={3} lg={2}>
              <Nav variant="pills" className="flex-column mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="dashboard" className="mb-2">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users" className="mb-2">
                    <i className="bi bi-people me-2"></i>
                    Users
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="products" className="mb-2">
                    <i className="bi bi-box me-2"></i>
                    Products
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div className="text-center mt-4">
                <Card className="bg-light">
                  <Card.Body>
                    <div className="mb-2">Logged in as:</div>
                    <div className="fw-bold">{user?.name || 'Admin'}</div>
                    <div className="text-muted small">Administrator</div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={9} lg={10}>
              <Tab.Content>
                <Tab.Pane eventKey="dashboard">
                  <Dashboard stats={stats} />
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  <UserList backendUrl={backendUrl} />
                </Tab.Pane>
                <Tab.Pane eventKey="products">
                  <ProductList backendUrl={backendUrl} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
    </Container>
  );
};

export default AdminPage; 