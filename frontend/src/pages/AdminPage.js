import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Nav, Tab } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import Pagination from '../components/Pagination';
import '../styles/AdminPage.css';
import '../styles/NavigationButtons.css';
// Dashboard Component
const Dashboard = ({ stats, ordersForAdmin }) => {
  // Calculate revenue metrics directly from orders
  const calculateRevenueMetrics = (orders) => {
    const validOrders = orders.filter(order => order.status !== "cancelled");
    
    // Calculate total revenue
    const totalRevenue = validOrders.reduce((sum, order) => {
      // Ensure we're working with numbers
      const orderPrice = order.total_price ? Number(order.total_price) : 0;
      return sum + orderPrice;
    }, 0);
    
    // Calculate revenue by day/week/month
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyRevenue = validOrders
      .filter(order => new Date(order.createdAt) >= oneDayAgo)
      .reduce((sum, order) => sum + (order.total_price || 0), 0);
      
    const weeklyRevenue = validOrders
      .filter(order => new Date(order.createdAt) >= oneWeekAgo)
      .reduce((sum, order) => sum + (order.total_price || 0), 0);
      
    const monthlyRevenue = validOrders
      .filter(order => new Date(order.createdAt) >= oneMonthAgo)
      .reduce((sum, order) => sum + (order.total_price || 0), 0);
    
    return {
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue
    };
  };
  
  // Calculate order metrics
  const calculateOrderMetrics = (orders) => {
    // Count orders by status
    const processingOrders = orders.filter(order => order.status === "processing").length;
    const completedOrders = orders.filter(order => order.status === "completed").length;
    const cancelledOrders = orders.filter(order => order.status === "cancelled").length;
    
    // Count orders by delivery method
    const deliveryOrders = orders.filter(order => order.delivery === "delivery").length;
    const storePickupOrders = orders.filter(order => order.delivery === "store").length;
    
    // Count orders by time period
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayOrders = orders.filter(order => new Date(order.createdAt) >= oneDayAgo).length;
    const weekOrders = orders.filter(order => new Date(order.createdAt) >= oneWeekAgo).length;
    
    return {
      total: orders.length,
      processing: processingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      delivery: deliveryOrders,
      storePickup: storePickupOrders,
      today: todayOrders,
      week: weekOrders
    };
  };
  
  const revenueMetrics = calculateRevenueMetrics(ordersForAdmin);
  const orderMetrics = calculateOrderMetrics(ordersForAdmin);
  
  // Format currency function
  const formatCurrency = (amount) => {
    // Ensure the amount is a valid number
    const validAmount = isNaN(Number(amount)) ? 0 : Number(amount);
    
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(validAmount);
  };

  return (
    <div>
      <Row className="mt-4">
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Tổng Sản Phẩm</Card.Title>
              <Card.Text className="display-4">{stats.totalProducts}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Tổng Đơn Hàng</Card.Title>
              <Card.Text className="display-4">{orderMetrics.total}</Card.Text>
              <div className="text-muted small">
                Đang xử lý: {orderMetrics.processing} | Hoàn thành: {orderMetrics.completed} | Đã hủy: {orderMetrics.cancelled}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Tổng Người Dùng</Card.Title>
              <Card.Text className="display-4">{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Tổng Doanh Thu</Card.Title>
              <Card.Text className="display-4">{formatCurrency(revenueMetrics.totalRevenue || 0)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h3 className="mt-4 mb-3">Thống Kê Doanh Thu</h3>
      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Doanh Thu Hôm Nay</Card.Title>
              <Card.Text className="display-5 text-primary">{formatCurrency(revenueMetrics.dailyRevenue)}</Card.Text>
              <div className="text-muted">Đơn hàng: {orderMetrics.today}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Doanh Thu Tuần Này</Card.Title>
              <Card.Text className="display-5 text-success">{formatCurrency(revenueMetrics.weeklyRevenue)}</Card.Text>
              <div className="text-muted">Đơn hàng: {orderMetrics.week}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Doanh Thu Tháng Này</Card.Title>
              <Card.Text className="display-5 text-info">{formatCurrency(revenueMetrics.monthlyRevenue)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h3 className="mt-4 mb-3">Thống Kê Đơn Hàng</h3>
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Theo Trạng Thái</h5>
              <div className="d-flex justify-content-between mb-2">
                <div>Đang xử lý:</div>
                <div className="fw-bold">{orderMetrics.processing}</div>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-warning" 
                  role="progressbar" 
                  style={{ width: `${orderMetrics.total ? (orderMetrics.processing / orderMetrics.total * 100) : 0}%` }}
                  aria-valuenow={orderMetrics.processing} 
                  aria-valuemin="0" 
                  aria-valuemax={orderMetrics.total}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <div>Hoàn thành:</div>
                <div className="fw-bold">{orderMetrics.completed}</div>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${orderMetrics.total ? (orderMetrics.completed / orderMetrics.total * 100) : 0}%` }}
                  aria-valuenow={orderMetrics.completed} 
                  aria-valuemin="0" 
                  aria-valuemax={orderMetrics.total}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <div>Đã hủy:</div>
                <div className="fw-bold">{orderMetrics.cancelled}</div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar bg-danger" 
                  role="progressbar" 
                  style={{ width: `${orderMetrics.total ? (orderMetrics.cancelled / orderMetrics.total * 100) : 0}%` }}
                  aria-valuenow={orderMetrics.cancelled} 
                  aria-valuemin="0" 
                  aria-valuemax={orderMetrics.total}
                ></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="card-title mb-3">Phương Thức Nhận Hàng</h5>
              <div className="d-flex justify-content-between mb-2">
                <div>Giao hàng tận nơi:</div>
                <div className="fw-bold">{orderMetrics.delivery}</div>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-info" 
                  role="progressbar" 
                  style={{ width: `${orderMetrics.total ? (orderMetrics.delivery / orderMetrics.total * 100) : 0}%` }}
                  aria-valuenow={orderMetrics.delivery} 
                  aria-valuemin="0" 
                  aria-valuemax={orderMetrics.total}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <div>Nhận tại cửa hàng:</div>
                <div className="fw-bold">{orderMetrics.storePickup}</div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{ width: `${orderMetrics.total ? (orderMetrics.storePickup / orderMetrics.total * 100) : 0}%` }}
                  aria-valuenow={orderMetrics.storePickup} 
                  aria-valuemin="0" 
                  aria-valuemax={orderMetrics.total}
                ></div>
              </div>
              
              <div className="mt-4">
                <h6>Thống kê theo thời gian</h6>
                <div className="d-flex justify-content-between mt-3">
                  <div>Đơn hàng hôm nay:</div>
                  <div className="fw-bold">{orderMetrics.today}</div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <div>Đơn hàng tuần này:</div>
                  <div className="fw-bold">{orderMetrics.week}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// UserList Component
const UserList = ({ backendUrl }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {usersForAdmin, setUsersForAdmin} = useContext(AppContext)
  // setUsers(usersForAdmin)

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
      const { data } = await axios.get(`${backendUrl}/admin/user`, config);
      setUsersForAdmin(data.user || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi khi tải danh sách người dùng');
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
      toast.success('Cập nhật thông tin người dùng thành công');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Lỗi cập nhật thông tin người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true
        };
        await axiosInstance.delete(`${backendUrl}/admin/user/${userId}`, config);
        toast.success('Đã xóa người dùng thành công');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Người Dùng</h2>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai Trò</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {usersForAdmin.map((user) => (
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
                  Chỉnh Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={user.role === "admin"}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination pageName="usersForAdmin" />

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleEditUser}>
              <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
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
                  // onChange={(e) =>
                  //   setSelectedUser({ ...selectedUser, email: e.target.value })
                  // }
                  readOnly
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vai Trò</Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  required
                >
                  <option value="user" disabled={selectedUser.role === "admin"}>Người Dùng</option>
                  <option value="admin">Quản Trị Viên</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit">
                  Lưu Thay Đổi
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
    const { productItems, setProductItems } = useContext(AppContext);
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
        images: [],
        currency: 'VND', // Default currency
        discount: 0,     // Default discount
        features: []     // Features array
    });
  
    // Currencies available for selection
    const currencies = ['VND', 'USD', 'EUR', 'GBP'];

    // We'll display either the locally fetched products or the products from context
    const [products, setProducts] = useState([]);

    // Filter states
    const [filterCategory, setFilterCategory] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterName, setFilterName] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    
    // Fetch categories and brands for filters
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // Fetch brands
                const brandResponse = await axios.get(`${backendUrl}/product/brand`);
                if (brandResponse.data && brandResponse.data.message === "Success") {
                    setBrands(brandResponse.data.brandFound || []);
                }
                
                // Fetch categories
                const categoryResponse = await axios.get(`${backendUrl}/product/category`);
                if (categoryResponse.data && categoryResponse.data.message === "Success") {
                    setCategories(categoryResponse.data.categoryFound || []);
                }
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        };
        
        fetchFilters();
    }, [backendUrl]);

    // // Keep the original fetchProducts function for CRUD operations
    // const fetchProducts = async () => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //             withCredentials: true
    //         };
    //         const { data } = await axios.get(`${backendUrl}/product`, config);
    //         setProducts(data.product || []);
    //     } catch (error) {
    //         console.error('Error fetching products:', error);
    //         toast.error('Lỗi khi tải danh sách sản phẩm');
    //     }
    // };

    // When productItems changes (e.g., through pagination), update our local state
    useEffect(() => {
        if (productItems && productItems.length > 0) {
            setProducts(productItems);
        }
    }, [productItems]);

    // On initial load, fetch products directly
    // useEffect(() => {
    //     fetchProducts();
    // }, []);

    // Apply filters to products
    const handleApplyFilters = async () => {
        setIsFiltering(true);
        try {
            let params = { page: 1, limit: 18 };
            
            if (filterName) params.search = filterName;
            if (filterCategory) params.category = filterCategory;
            if (filterBrand) params.brand = filterBrand;
            if (filterPriceMin) params.priceMin = filterPriceMin;
            if (filterPriceMax) params.priceMax = filterPriceMax;
            console.log(params);
            const response = await axios.get(`${backendUrl}/product`, { params});
            console.log(response.data);
            
            if (response.data && response.data.product) {
                setProducts(response.data.product);
                // We don't update the context to avoid affecting pagination
            }
        } catch (error) {
            console.error('Error applying filters:', error);
            toast.error('Lỗi khi lọc sản phẩm');
        } finally {
            setIsFiltering(false);
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilterName('');
        setFilterCategory('');
        setFilterBrand('');
        setFilterPriceMin('');
        setFilterPriceMax('');
        // fetchProducts(); // Reset to original list
    };

    // Helper function to refresh the current pagination page
    const refreshCurrentPage = async () => {
        try {
            // Get the current page number from the pagination UI
            // Find button with yellow background (current page) or default to page 1
            const paginationButtons = document.querySelectorAll('.pagination button');
            let pageNumber = 1;
            
            for (let button of paginationButtons) {
                if (button.style.backgroundColor === '#FFD400' || 
                    button.style.backgroundColor === 'rgb(255, 212, 0)') {
                    const buttonText = button.textContent;
                    if (!isNaN(buttonText)) {
                        pageNumber = parseInt(buttonText);
                        break;
                    }
                }
            }
            
            const response = await axios.get(`${backendUrl}/product`, {
                params: { page: pageNumber }
            });
            
            if (response.data && response.data.product) {
                // Update both local state and context
                setProducts(response.data.product);
                setProductItems(response.data.product);
            }
        } catch (error) {
            console.error('Error refreshing current page:', error);
        }
    };

    // Format currency for display
    const formatCurrency = (amount, currency = 'VND') => {
        // Validate currency code - use VND as fallback if invalid
        const validCurrency = ['VND', 'USD', 'EUR', 'GBP'].includes(currency) ? currency : 'VND';
        
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: validCurrency,
            maximumFractionDigits: 0
        }).format(amount);
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
                currency: newProduct.currency,
                discount: Number(newProduct.discount),
                features: typeof newProduct.features === 'string' 
                    ? newProduct.features.split(',').map(feature => feature.trim()) 
                    : newProduct.features
            };

            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };
      
            await axiosInstance.post(`${backendUrl}/product/`, productData, config);
            toast.success('Thêm sản phẩm thành công');
            setShowAddModal(false);
            setNewProduct({
                productName: '',
                price: '',
                description: '',
                category: [],
                brand: '',
                stocks: '',
                color: [],
                images: [],
                currency: 'VND', 
                discount: 0,
                features: []
            });
            
            // First fetch all products to update the local state
            // fetchProducts();
            
            // Then refresh the current pagination page to keep UI consistent
            refreshCurrentPage();
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(`Lỗi khi thêm sản phẩm: ${error.response?.data?.message || error.message}`);
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
                currency: selectedProduct.currency,
                discount: Number(selectedProduct.discount),
                features: typeof selectedProduct.features === 'string' 
                    ? selectedProduct.features.split(',').map(feature => feature.trim()) 
                    : selectedProduct.features
            };

           // console.log('Sending product data:', productData);

            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            };
      
            await axios.put(`${backendUrl}/product/${selectedProduct._id}`, productData, config);
            toast.success('Cập nhật sản phẩm thành công');
            setShowEditModal(false);
            // fetchProducts();
            
            // Also refresh the current pagination page to keep UI consistent
            refreshCurrentPage();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(`Lỗi khi cập nhật sản phẩm: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true
                };
                await axiosInstance.delete(`${backendUrl}/product/${productId}`, config);
                toast.success('Đã xóa sản phẩm thành công');
                // fetchProducts();
                
                // Also refresh the current pagination page to keep UI consistent
                refreshCurrentPage();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error(`Lỗi khi xóa sản phẩm: ${error.response?.data?.message || error.message}`);
            }
        }
    };
    
    const prepareProductForEdit = (product) => {
        return {
            ...product,
            category: Array.isArray(product.category) ? product.category.join(', ') : product.category,
            color: Array.isArray(product.color) ? product.color.join(', ') : product.color,
            // features: Array.isArray(product.features) ? product.features.join(', ') : product.features || ''
        };
    };
    console.log("product", products)

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản Lý Sản Phẩm</h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Thêm Sản Phẩm Mới
                </Button>
            </div>

            {/* Filter Section */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h5 className="mb-3">Lọc Sản Phẩm</h5>
                    <Form>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên Sản Phẩm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm theo tên"
                                        value={filterName}
                                        onChange={(e) => setFilterName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Danh Mục</Form.Label>
                                    <Form.Select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map((cat, index) => (
                                            <option key={index} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Thương Hiệu</Form.Label>
                                    <Form.Select
                                        value={filterBrand}
                                        onChange={(e) => setFilterBrand(e.target.value)}
                                    >
                                        <option value="">Tất cả thương hiệu</option>
                                        {brands.map((brand, index) => (
                                            <option key={index} value={brand.name}>{brand.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Khoảng Giá</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control
                                            type="number"
                                            placeholder="Từ"
                                            className="me-2"
                                            value={filterPriceMin}
                                            onChange={(e) => setFilterPriceMin(e.target.value)}
                                        />
                                        <span>-</span>
                                        <Form.Control
                                            type="number"
                                            placeholder="Đến"
                                            className="ms-2"
                                            value={filterPriceMax}
                                            onChange={(e) => setFilterPriceMax(e.target.value)}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end">
                            <Button 
                                variant="outline-secondary" 
                                className="me-2"
                                onClick={handleClearFilters}
                            >
                                Xóa Bộ Lọc
                            </Button>
                            <Button 
                                variant="success" 
                                onClick={handleApplyFilters}
                                disabled={isFiltering}
                            >
                                {isFiltering ? 'Đang Lọc...' : 'Áp Dụng Bộ Lọc'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Products Table */}
            <Card className="shadow">
                <Card.Body>
                    <Table striped bordered hover responsive className="product-table">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-nowrap" width="5%">ID</th>
                                <th width="20%">Tên Sản Phẩm</th>
                                <th width="10%">Thương Hiệu</th>
                                <th width="10%">Giá</th>
                                <th width="15%">Danh Mục</th>
                                <th width="10%">Tồn Kho</th>
                                <th width="10%">Giảm Giá</th>
                                <th width="20%">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="text-truncate" style={{ maxWidth: '100px' }}>
                                            {product._id}
                                        </td>
                                        <td>{product.productName}</td>
                                        <td>{product.brand}</td>
                                        <td className="text-nowrap">{formatCurrency(product.price, product.currency || 'VND')}</td>
                                        <td>
                                            {Array.isArray(product.category) ? 
                                                product.category.map((cat, i) => (
                                                    <span key={i} className="badge bg-info me-1 mb-1">{cat}</span>
                                                )) : 
                                                <span className="badge bg-info">{product.category}</span>
                                            }
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${product.stocks > 10 ? 'bg-success' : product.stocks > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                                {product.stocks}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {product.discount > 0 ? (
                                                <span className="badge bg-danger">{product.discount}%</span>
                                            ) : (
                                                <span className="text-muted">Không</span>
                                            )}
                                        </td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => {
                                                    setSelectedProduct(prepareProductForEdit(product));
                                                    setShowEditModal(true);
                                                    console.log("productselected:", product)
                                                    console.log("productselected1:", selectedProduct)
                                                }}
                                            >
                                                Chỉnh Sửa
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                Xóa
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-3">
                                        {isFiltering ? 'Đang tải dữ liệu...' : 'Không tìm thấy sản phẩm nào'}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                </Card.Body>
            </Card>

            <Pagination pageName="productsPage" />

            {/* Add Product Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Sản Phẩm Mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddProduct}>
                        <Row>
                            <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label>Tên Sản Phẩm</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.productName}
                                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                                required
                            />
                        </Form.Group>
                            </Col>
                            <Col md={3}>
                        <Form.Group className="mb-3">
                                    <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                            />
                        </Form.Group>
                            </Col>
                            <Col md={3}>
                        <Form.Group className="mb-3">
                                    <Form.Label>Tiền tệ</Form.Label>
                                    <Form.Select
                                        value={newProduct.currency}
                                        onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                                        required
                                    >
                                        {currencies.map((currency) => (
                                            <option key={currency} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Thương Hiệu</Form.Label>
                            <Form.Control
                                        type="text"
                                        value={newProduct.brand}
                                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tồn Kho</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newProduct.stocks}
                                        onChange={(e) => setNewProduct({ ...newProduct, stocks: e.target.value })}
                                required
                            />
                        </Form.Group>
                            </Col>
                            <Col md={3}>
                        <Form.Group className="mb-3">
                                    <Form.Label>Giảm giá (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newProduct.discount}
                                        onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Danh Mục (cách nhau bằng dấu phẩy)</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                placeholder="Điện tử, Đồ gia dụng, ..."
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Màu Sắc (cách nhau bằng dấu phẩy)</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.color}
                                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                                placeholder="Đỏ, Xanh, ..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL Hình Ảnh</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProduct.images}
                                onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô Tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Thông số kỹ thuật</Form.Label>
                          {(Array.isArray(newProduct?.features) && newProduct.features.length > 0) &&
                          (newProduct.features.map((item, index) => {
                            const [label, value] = item.split(":")
                            const handleLabelChange = (e) => {
                              const newLabel = e.target.value;
                              const updatedFeatures = [...newProduct.features];
                              const [, value = ""] = updatedFeatures[index].split(":");

                              if (newLabel.trim() === "" && value.trim() === "") {
                                updatedFeatures.splice(index, 1); // Xoá dòng nếu cả label và value rỗng
                              } else {
                                updatedFeatures[index] = `${newLabel}:${value.trim()}`;
                              }

                              setNewProduct(prev => ({ ...prev, features: updatedFeatures }));
                            };
                            const handleValueChange = (e) => {
                              const newValue = e.target.value;
                              const updatedFeatures = [...newProduct.features];
                              const [label = ""] = updatedFeatures[index].split(":");

                              if (label.trim() === "" && newValue.trim() === "") {
                                updatedFeatures.splice(index, 1); // Xoá dòng nếu cả label và value rỗng
                              } else {
                                updatedFeatures[index] = `${label.trim()}:${newValue}`;
                              }

                              setNewProduct(prev => ({ ...prev, features: updatedFeatures }));
                            };
                            return (
                            <Row key={index} className='my-1'>
                              <Col md={3}>
                                <Form.Group>
                                  <Form.Control 
                                  type='text'
                                  value={label}
                                  onChange={handleLabelChange}
                                  placeholder='Tên thông số'
                                  />
                                </Form.Group>
                              </Col>
  
                              <Col md={9}>
                                <Form.Group>
                                  <Form.Control 
                                  type='text'
                                  value={value}
                                  onChange={handleValueChange}
                                  placeholder='Chi tiết thông số kĩ thuật'
                                  />
                                </Form.Group>
                              </Col>
                            </Row>  
                            )
                          }))
                          }
                          <div className='d-block'>
                            <Button
                                variant="secondary"
                                className="mt-2 d-block-inline"
                                onClick={() => {
                                  const updatedFeatures = [...(newProduct?.features || [])];
                                  updatedFeatures.push(":"); // Thêm dòng trống (label:value)
                                  setNewProduct(prev => ({ ...prev, features: updatedFeatures }));
                                }}
                              >
                                Thêm thông số
                            </Button>
                            <Button
                            variant="danger"
                            className="mt-2 ms-2"
                            onClick={() => {
                              const confirmDelete = window. confirm("Bạn có chắc chắn xóa tất cả thông số kỹ thuật?")
                              if(confirmDelete) {
                                setNewProduct(prev => ({ ...prev, features: [] }));
                              }
                            }}
                          >
                            Xoá tất cả thông số 
                            </Button>
                          </div>
                        </Form.Group>                  
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={() => {
                                setNewProduct(prev => ({...prev, features: []}))
                                setShowAddModal(false)
                                }}>
                                Hủy
                            </Button>
                        <Button variant="primary" type="submit">
                                Thêm Sản Phẩm
                        </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh Sửa Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <Form onSubmit={handleEditProduct}>
                            <Row>
                                <Col md={6}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Tên Sản Phẩm</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.productName}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                                </Col>
                                <Col md={3}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Giá</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedProduct.price}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                                    required
                                />
                            </Form.Group>
                                </Col>
                                <Col md={3}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Tiền tệ</Form.Label>
                                        <Form.Select
                                            value={selectedProduct.currency || 'VND'}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, currency: e.target.value })}
                                    required
                                        >
                                            {currencies.map((currency) => (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            ))}
                                        </Form.Select>
                            </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Thương Hiệu</Form.Label>
                                <Form.Control
                                    type="text"
                                            value={selectedProduct.brand}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, brand: e.target.value })}
                                />
                            </Form.Group>
                                </Col>
                                <Col md={3}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Tồn Kho</Form.Label>
                                <Form.Control
                                            type="number"
                                            value={selectedProduct.stocks}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, stocks: e.target.value })}
                                    required
                                />
                            </Form.Group>
                                </Col>
                                <Col md={3}>
                            <Form.Group className="mb-3">
                                        <Form.Label>Giảm giá (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                            min="0"
                                            max="100"
                                            value={selectedProduct.discount || 0}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, discount: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Danh Mục (cách nhau bằng dấu phẩy)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.category}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Màu Sắc (cách nhau bằng dấu phẩy)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.color}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, color: e.target.value })}
                                />
                            </Form.Group>
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Tính năng (cách nhau bằng dấu phẩy)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedProduct.features}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, features: e.target.value })}
                                    placeholder="Chống nước, Bluetooth, ..."
                                />
                            </Form.Group> */}
                            <Form.Group className="mb-3">
                                <Form.Label>Mô Tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedProduct.description}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>Thông số kỹ thuật</Form.Label>
                              {(Array.isArray(selectedProduct?.features) && selectedProduct.features.length > 0) &&
                              (selectedProduct.features.map((item, index) => {
                                const [label, value] = item.split(":")
                                const handleLabelChange = (e) => {
                                  const newLabel = e.target.value;
                                  const updatedFeatures = [...selectedProduct.features];
                                  const [, value = ""] = updatedFeatures[index].split(":");

                                  if (newLabel.trim() === "" && value.trim() === "") {
                                    updatedFeatures.splice(index, 1); // Xoá dòng nếu cả label và value rỗng
                                  } else {
                                    updatedFeatures[index] = `${newLabel}:${value.trim()}`;
                                  }

                                  setSelectedProduct(prev => ({ ...prev, features: updatedFeatures }));
                                };
                                const handleValueChange = (e) => {
                                  const newValue = e.target.value;
                                  const updatedFeatures = [...selectedProduct.features];
                                  const [label = ""] = updatedFeatures[index].split(":");

                                  if (label.trim() === "" && newValue.trim() === "") {
                                    updatedFeatures.splice(index, 1); // Xoá dòng nếu cả label và value rỗng
                                  } else {
                                    updatedFeatures[index] = `${label.trim()}:${newValue}`;
                                  }

                                  setSelectedProduct(prev => ({ ...prev, features: updatedFeatures }));
                                };
                                return (
                                <Row key={index} className='my-1'>
                                  <Col md={3}>
                                    <Form.Group>
                                      <Form.Control 
                                      type='text'
                                      value={label}
                                      onChange={handleLabelChange}
                                      placeholder='Tên thông số'
                                      />
                                    </Form.Group>
                                  </Col>
      
                                  <Col md={9}>
                                    <Form.Group>
                                      <Form.Control 
                                      type='text'
                                      value={value}
                                      onChange={handleValueChange}
                                      placeholder='Chi tiết thông số kĩ thuật'
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>  
                                )
                              }))
                              }
                              <div className='d-block'>
                                <Button
                                    variant="secondary"
                                    className="mt-2 d-block-inline"
                                    onClick={() => {
                                      const updatedFeatures = [...(selectedProduct?.features || [])];
                                      updatedFeatures.push(":"); // Thêm dòng trống (label:value)
                                      setSelectedProduct(prev => ({ ...prev, features: updatedFeatures }));
                                    }}
                                  >
                                    Thêm thống số
                                </Button>
                                <Button
                                variant="danger"
                                className="mt-2 ms-2"
                                onClick={() => {
                                  const confirmDelete = window. confirm("Bạn có chắc chắn xóa tất cả thông số kỹ thuật?")
                                  if(confirmDelete) {
                                    setSelectedProduct(prev => ({ ...prev, features: [] }));
                                  }
                                }}
                              >
                                Xoá tất cả thống số 
                                </Button>
                              </div>
                            </Form.Group>
                           
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                                    Hủy
                                </Button>
                            <Button variant="primary" type="submit">
                                    Lưu Thay Đổi
                            </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

// OrderList Component
const OrderList = ({ backendUrl }) => {
  const { ordersForAdmin } = useContext(AppContext);
  const [expandedRows, setExpandedRows] = useState([]);
  const [productData, setProductData] = useState({});

  const handleUpdateOrderDetail = async (status, orderId) => {
    const message =
      status === "completed"
        ? "Bạn chắc chắn đã giao đơn hàng này?"
        : "Bạn chắc chắn muốn hủy đơn hàng này?";

    if (!window.confirm(message)) return;

    try {
      await axiosInstance.put(
        `${backendUrl}/admin/order/${orderId}`,
        { updateData: { status } },
        { withCredentials: true }
      );
      toast.success("Cập nhật đơn hàng thành công");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Lỗi cập nhật đơn hàng");
      console.log(error.message);
    }
  };

  const toggleRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const fetchProductInfo = async (productId) => {
    if (productData[productId]) return;

    try {
      const res = await axios.get(`${backendUrl}/product/${productId}`);
      const product = res.data.product[0]; 
      setProductData((prev) => ({
        ...prev,
        [productId]: {
          name: product.productName,
          price: product.price,
        },
      }));
    } catch (err) {
      console.error("Lỗi khi tải thông tin sản phẩm:", err);
    }
  };

  useEffect(() => {
    ordersForAdmin.forEach((order) => {
      (order.items || []).forEach((item) => {
        fetchProductInfo(item.product);
      });
    });
  }, [ordersForAdmin]);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Đơn Hàng</h2>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>ID Đơn hàng</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Cập nhật trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {ordersForAdmin.map((order) => (
            <Fragment key={order._id}>
              <tr>
                <td>
                  <div className="d-flex align-items-center">
                    {order._id}
                    <button
                      className="btn ms-auto"
                      onClick={() => toggleRow(order._id)}
                    >
                      <i
                        className={`bi ${
                          expandedRows.includes(order._id)
                            ? "bi-caret-up-fill"
                            : "bi-caret-down-fill"
                        }`}
                      ></i>
                    </button>
                  </div>
                </td>
                <td>{order.user.user.name}</td>
                <td>{order.user.user.email}</td>
                <td>{`${order.total_price.toLocaleString("vi-VN")} VND`}</td>
                <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                <td>
                  {order.status === "processing" &&
                    order.delivery === "delivery" && (
                      <p className="dangGiao">Đang giao hàng</p>
                    )}
                  {order.status === "completed" && (
                    <p className="daNhan">Đã nhận hàng</p>
                  )}
                  {order.status === "cancelled" && (
                    <p className="daHuy">Đã hủy đơn hàng</p>
                  )}
                  {order.delivery === "store" &&
                    order.status === "processing" && (
                      <p className="nhanTaiCuaHang">Nhận tại cửa hàng</p>
                    )}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      handleUpdateOrderDetail("completed", order._id)
                    }
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    Đã giao
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      handleUpdateOrderDetail("cancelled", order._id)
                    }
                    disabled={
                      order.status === "completed" ||
                      order.status === "cancelled"
                    }
                  >
                    Hủy đơn
                  </Button>
                </td>
              </tr>

              {expandedRows.includes(order._id) && (
                <tr>
                  <td colSpan={7}>
                  <div className="mt-2">
                    <strong>Chi tiết đơn hàng:</strong>
                    {(order.items || []).map((item, index) => {
                      const product = productData[item.product];
                      return (
                        <div className="row mb-2" key={index}>
                          <div className="col-md-5">
                            {product
                              ? `${product.name}`
                              : "(Đang tải...)"}
                          </div>
                          <div className="col-md-4">
                            {product
                              ? `Đơn giá: ${product.price.toLocaleString("vi-VN")} VND`
                              : ""}
                          </div>
                          <div className="col-md-3">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </Table>

      <Pagination pageName="ordersForAdmin" />
    </div>
  );
};

const AdminPage = () => {
  const { backendUrl, isLoggedIn, user, setUserData, setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [ordersForAdmin, setOrdersForAdmin] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchOrders();
      await fetchStats();
    };
    
    loadData();
  }, [isLoggedIn, user, navigate]);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      
      // First, get the total pages
      const totalPagesResponse = await axiosInstance.get(`${backendUrl}/admin/order`, config);
      const totalPages = totalPagesResponse.data.totalPages || 1;
      
      // Fetch all orders from all pages
      let allOrders = [];
      
      for (let page = 1; page <= totalPages; page++) {
        const response = await axiosInstance.get(`${backendUrl}/admin/order`, {
          ...config,
          params: { page }
        });
        
        if (response.data && response.data.data) {
          allOrders = [...allOrders, ...response.data.data];
        }
      }
      
      setOrdersForAdmin(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải đơn hàng');
    }
  };

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      };
      
      // Fetch total products (all pages)
      const productPageRes = await axios.get(`${backendUrl}/product/page`);
      const totalProductPages = productPageRes.data.page.totalPages || 1;
      
      let allProducts = [];
      for (let page = 1; page <= totalProductPages; page++) {
        const productsRes = await axios.get(`${backendUrl}/product`, {
          ...config,
          params: { page }
        });
        
        if (productsRes.data && productsRes.data.product) {
          allProducts = [...allProducts, ...productsRes.data.product];
        }
      }
      
      // Fetch total users (all pages)
      const userPageRes = await axiosInstance.get(`${backendUrl}/admin/user`, {
        ...config,
        params: { page: 1 }
      });
      const totalUserPages = userPageRes.data.totalPages || 1;
      
      let allUsers = [];
      for (let page = 1; page <= totalUserPages; page++) {
        const usersRes = await axiosInstance.get(`${backendUrl}/admin/user`, {
          ...config,
          params: { page }
        });
        
        if (usersRes.data && usersRes.data.user) {
          allUsers = [...allUsers, ...usersRes.data.user];
        }
      }
      
      // Ensure we have the orders data before calculating revenue
      if (!ordersForAdmin || ordersForAdmin.length === 0) {
        console.log("No orders available for revenue calculation");
      }
      
      // Calculate total revenue from all valid orders (non-cancelled)
      const totalRevenue = ordersForAdmin
        .filter(order => order.status !== "cancelled")
        .reduce((sum, order) => {
          // Ensure we're working with numbers
          const orderPrice = order.total_price ? Number(order.total_price) : 0;
          return sum + orderPrice;
        }, 0);
      
      //console.log(`Calculated total revenue: ${totalRevenue} from ${ordersForAdmin.length} orders`);
      
      setStats({
        totalProducts: allProducts.length,
        totalOrders: ordersForAdmin.length,
        totalUsers: allUsers.length,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Lỗi khi tải thống kê');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.setItem('isLoggedIn', 'false');
    setUserData({});
    setIsLoggedIn(false);
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <Container fluid className="admin-page-container py-4">
      <h1 className="mb-4 text-center">Quản lý cửa hàng</h1>
      <Row>
        <Tab.Container id="admin-tabs" activeKey={activeKey} onSelect={setActiveKey}>
          <Row>
            <Col md={3} lg={2}>
              <Nav variant="pills" className="flex-column mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="dashboard" className="mb-2">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Tổng quan
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="users" className="mb-2">
                    <i className="bi bi-people me-2"></i>
                    Người Dùng
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="products" className="mb-2">
                    <i className="bi bi-box me-2"></i>
                    Sản Phẩm
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="orders" className="mb-2">
                    <i className="bi bi-cart-check me-2"></i>
                    Đơn Hàng
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <div className="text-center mt-4">
                <Card className="bg-light">
                  <Card.Body>
                    <div className="mb-2">Đăng nhập với:</div>
                    <div className="fw-bold">{user?.name || 'Admin'}</div>
                    <div className="text-muted small">Quản Trị Viên</div>
                    <Button 
                      variant="danger" 
                      className="mt-3 w-100 logout-btn"
                      onClick={handleLogout}
                    >
                      Đăng Xuất
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={9} lg={10}>
              <Tab.Content>
                <Tab.Pane eventKey="dashboard">
                  <Dashboard stats={stats} ordersForAdmin={ordersForAdmin} />
                </Tab.Pane>
                <Tab.Pane eventKey="users">
                  <UserList backendUrl={backendUrl} />
                </Tab.Pane>
                <Tab.Pane eventKey="products">
                  <ProductList backendUrl={backendUrl} />
                </Tab.Pane>
                <Tab.Pane eventKey="orders">
                  <OrderList backendUrl={backendUrl} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Row>
      
      <Link to="/">
        <Button 
          className="nav-button home-button"
        >
          <i className="bi bi-house-door"></i>
          Về Trang Chủ
        </Button>
      </Link>
        </Container>
    );
};

export default AdminPage; 