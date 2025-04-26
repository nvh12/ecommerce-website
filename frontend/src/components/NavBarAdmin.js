import React, { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NavBarAdmin = () => {
    const navigate = useNavigate();
    const { userData, isLoggedIn } = useContext(AppContext);


    return (
        <div>
            <div className='container-fluid row d-flex shadow p-3 rounded' style={{backgroundColor: '#FFD400'}}>
                <div className='col-2 d-flex me-auto'>
                    <h2 className='mx-auto' style={{cursor: "pointer"}}
                    onClick={() => navigate("/")}>Admin</h2>
                </div>
                <div className='col-auto d-flex'>
                    {isLoggedIn ? 
                    (<>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/user')}>
                            <i className="bi bi-person-circle me-1"></i>
                            <span className='d-none d-sm-inline'>{userData.name}</span>
                        </button>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/admin/productlist')}>
                            <i className="bi bi-archive-fill me-1"></i>
                            <span className='d-none d-sm-inline'>Mặt hàng</span>
                        </button>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/admin/userlist')}>
                            <i className="bi bi-person-fill-gear me-1"></i>
                            <span className='d-none d-sm-inline'>Người dùng</span>
                        </button>
                    </>)
                    :
                    (<>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/login')}>
                            <i className="bi bi-person-circle me-1"></i>
                            <span className='d-none d-sm-inline'>Đăng nhập</span>
                        </button>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/user')}>
                            <i className="bi bi-cart3 me-1"></i>
                            <span className='d-none d-sm-inline'>Giỏ hàng</span>
                        </button>
                    </>)}
                </div>
            </div>
        </div>
    );
}

export default NavBarAdmin;
