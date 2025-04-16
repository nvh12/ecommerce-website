import React from 'react'
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate('/login')
    }
  return (
    <div>
        <div className='container-fluid row d-flex shadow p-3 rounded' style={{backgroundColor: '#FFD400'}}>
            <div className='col-2 d-flex me-auto'>
                <h2 className='mx-auto'>EShop</h2>
            </div>
            <div className='col-5 mx-auto'>
                    <div className='input-group flex-nowrap bg-white rounded '>
                        <button className='btn'><i className="bi bi-search "></i></button>
                        <input type="text" placeholder='Bạn tìm gì...'
                        className='form-control border-0 shadow-none outline-none '/>
                    </div>
            </div>
            <div className='col-auto d-flex'>
                <button className='bg-transparent btn rounded-pill hover-style'
                onClick={goToLogin}>
                    <i class="bi bi-person-circle me-1"></i>
                    <span className='d-none d-sm-inline'>Đăng nhập</span>
                </button>
                <button className='bg-transparent btn rounded-pill hover-style'
                >
                    <i class="bi bi-cart3 me-1"></i>
                    <span className='d-none d-sm-inline'>Giỏ hàng </span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Header