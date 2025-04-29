import React, { useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import SearchBar from './SearchBar';

const Header = () => {
    const navigate = useNavigate();
    const { userData, isLoggedIn, cartItems } = useContext(AppContext);

    // useEffect(() => {
    //     console.log("userData updated:", userData); 
    // }, [isLoggedIn]);
    // console.log("isLoggedIn:", isLoggedIn);

    return (
        <div className='rounded shadow' style={{backgroundColor: '#FFD400'}}>
            <div className='container-fluid row d-flex p-3'>
                <div className='col-2 d-flex me-5 align-items-center'>
                    <h2 className='mx-auto mb-0' style={{cursor: "pointer"}}
                    onClick={() => navigate("/")}>EShop</h2>
                </div>
                {/* <div className='col-5 mx-auto'>
                    <div className='input-group flex-nowrap bg-white rounded'>
                        <button className='btn'><i className="bi bi-search"></i></button>
                        <input type="text" placeholder='Bạn tìm gì...'
                        className='form-control border-0 shadow-none outline-none'/>
                    </div>
                </div> */}
                <div className="col-5 ms-md-2 ms-0 me-auto d-flex align-items-center justify-content-center"> 
                    <SearchBar />
                </div>                
                <div className='col-md-auto col-3 d-flex'>
                    {isLoggedIn ? 
                    (<>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/user')}>
                            <i className="bi bi-person-circle me-1"></i>
                            <span className='d-none d-lg-inline'>{userData.name}</span>
                        </button>
                        <button className='bg-transparent btn rounded-pill hover-style'
                        onClick={() => navigate('/cart')}>
                            <i className="bi bi-cart3 me-1"></i>
                            <span className='d-none d-lg-inline'>Giỏ hàng</span>
                            {cartItems?.length > 0 && (
                                <span className="badge bg-danger ms-1">
                                    {cartItems.length}
                                </span>
                            )}
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

export default Header;
