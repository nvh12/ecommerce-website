import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import UserCard from '../../components/UserCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import NavBarAdmin from '../../components/NavBarAdmin'; 

const UserListPage = () => {
    const {userData, backendUrl, isLoggedIn} = useContext(AppContext)
    const [userList, setUserList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const navigate = useNavigate()
    console.log(isLoggedIn, userData)

    const fetchUserList = async () => {
        try {
            const res = await axios.get(`${backendUrl}/admin/user/`, {
                params: { name: searchTerm },
                withCredentials: true
              });
              
            // console.log("userlist", res.data.user)
            setUserList(res.data.user)
            toast.success("Lấy danh sách người dùng thành công")
        } catch (error) {
            toast.error("Lỗi lấy danh sách người dùng")
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        fetchUserList()
    }


    useEffect(() => {
        console.log(isLoggedIn, userData)
        if(!isLoggedIn || userData.role !== "admin") {
            toast.error("Bạn không có quyền truy cập trang này")
            navigate('/')
        }
        fetchUserList()
    }, [userData, isLoggedIn, navigate]);

    return (
        <>
            <NavBarAdmin />
            <div className='mt-4 container'>
                <h1>Danh sách người dùng</h1>
                <hr />
                <div className='shadow rounded mt-4'>
                    <div className='row justify-content-end p-3 mb-2'>
                        <div className='col-md-3 col-12'>
                            <form onSubmit={handleSearch} className='input-group flex-nowrap rounded bg-white'>
                                <input 
                                    type='text' 
                                    className='form-control rounded shadow-none outline-none'
                                    placeholder='Tìm kiếm nguời dùng...'
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
                        <div className='col-4'>
                            <b>Tên</b>
                        </div>
                        <div className='col-5'>
                            <b>Email</b>
                        </div>
                        <div className='col-2'>
                            <b>Vai trò</b>
                        </div>
                        <div className='col-1 text-center'>
                            <b>Đơn hàng</b>
                        </div>
                    </div>
                    <div>
                        {
                            userList.map((user, index) => (
                                <>
                                    <UserCard key={index} user={user}/>
                                </>
                            ))
                        }
                    </div> 
                </div> 
            </div>
        </>
    );
};

export default UserListPage;