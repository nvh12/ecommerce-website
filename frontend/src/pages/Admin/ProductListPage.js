import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
    const { backendUrl, isLoggedIn, userData } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log(isLoggedIn, userData);
        if (!isLoggedIn || userData.role !== 'admin') {
            navigate('/');
            toast.error('Bạn không có quyền truy cập trang này');
            return;
        }
        fetchProducts();
    }, [isLoggedIn, userData, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/product`, {
                params: { search: searchTerm }
            });
            setProducts(response.data.product || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`${backendUrl}/product/${productId}`, {
                    withCredentials: true
                });
                toast.success('Đã xóa sản phẩm thành công');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Không thể xóa sản phẩm');
            }
        }
    };

    const handleEdit = (product) => {
        navigate(`/admin/product/edit/${product._id}`, { state: { product } });
    };

    return (
        <div className='container'>
            <h1>Danh sách sản phẩm</h1>
            <hr />
            <div className='shadow rounded mt-4'>
                <div className='row justify-content-between p-3 mb-2'>
                    <div className='col-md-3 col-12'>
                        <button 
                            className='btn btn-primary'
                            onClick={() => navigate('/admin/product/add')}
                        >
                            <i className="bi bi-plus-lg me-2"></i>
                            Thêm sản phẩm
                        </button>
                    </div>
                    <div className='col-md-3 col-12'>
                        <form onSubmit={handleSearch} className='input-group flex-nowrap rounded bg-white'>
                            <input 
                                type='text' 
                                className='form-control rounded shadow-none outline-none'
                                placeholder='Tìm kiếm sản phẩm...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type='submit' className='btn'>
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
                <hr className='mx-3 border border-3 opacity-100'/>
                <div className='row mx-3 my-2'>
                    <div className='col-2'>
                        <b>Hình ảnh</b>
                    </div>
                    <div className='col-3'>
                        <b>Tên sản phẩm</b>
                    </div>
                    <div className='col-2'>
                        <b>Giá</b>
                    </div>
                    <div className='col-2'>
                        <b>Số lượng</b>
                    </div>
                    <div className='col-2'>
                        <b>Danh mục</b>
                    </div>
                    <div className='col-1'>
                        <b>Thao tác</b>
                    </div>
                </div>
                <div>
                    {products.map((product) => (
                        <div key={product._id} className='row mx-3 align-items-center'>
                            <div className='col-2'>
                                <img 
                                    src={product.images[0]} 
                                    alt={product.productName}
                                    className='img-thumbnail'
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </div>
                            <div className='col-3'>
                                <p className='mb-0'>{product.productName}</p>
                            </div>
                            <div className='col-2'>
                                <p className='mb-0'>{product.price.toLocaleString()} {product.currency}</p>
                            </div>
                            <div className='col-2'>
                                <p className='mb-0'>{product.stocks}</p>
                            </div>
                            <div className='col-2'>
                                <p className='mb-0'>{product.category.join(', ')}</p>
                            </div>
                            <div className='col-1 d-flex gap-2'>
                                <button 
                                    className='btn btn-sm btn-outline-primary'
                                    onClick={() => handleEdit(product)}
                                >
                                    <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button 
                                    className='btn btn-sm btn-outline-danger'
                                    onClick={() => handleDelete(product._id)}
                                >
                                    <i className="bi bi-trash2-fill"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage; 