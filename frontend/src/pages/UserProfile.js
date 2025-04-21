import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import UserProfileComponent from '../actions/UserProfileComponent'
import { toast } from 'react-toastify'
import axios from 'axios'

const UserProfile = () => {
  const { productItems, backendUrl, userData, setIsLoggedIn } = useContext(AppContext)

  const [activeSection, setActiveSection] = useState("account")
  const navigate = useNavigate()
  
  const handleMenuClick = (section) => {
    setActiveSection(section)
  }

  const onLogOutHandler = async () => {
    try {
      await axios.post(backendUrl + "/auth/logout", {withCredentials: true})
      console.log("Logout successfully")
      toast.success("Đăng xuất thành công")
      navigate('/')
      setIsLoggedIn(false)
    } catch (error) {
      toast.error("Lỗi đăng xuất")
    }
  }
  
  return (
    <div>
        <Header />
        <div className='container my-5'>
            <div className='row'>
                <div className='col-3 d-flex flex-column gap-2 border rounded'>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <p className='fs-2 m-0 mt-2'>{userData.name}</p>
                        <p className='text-muted small m-0'>{userData.email}</p>
                    </div>
                    <hr />
                    <div className='d-flex flex-column align-items-start gap-1 mb-2'>
                      <button className='d-inline-block bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('orders')}>
                        <i className="bi bi-inboxes-fill me-2"></i>
                        <span>Đơn hàng</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('wallet')}>
                        <i className="bi bi-wallet-fill me-2"></i>
                        <span>Ví</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('cart')}>
                        <i className="bi bi-basket3-fill me-2"></i>
                        <span>Giỏ hàng</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('account')}>
                        <i className="bi bi-person-circle me-2"></i>
                        <span>Thông tin tài khoản</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'>
                      <i className="bi bi-geo-alt-fill me-2"></i>
                        <span>Địa chỉ</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={onLogOutHandler}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                </div>
                <div className='col-9 d-flex flex-column  p-3 border rounded'>
                      <UserProfileComponent activeSection={activeSection} productItems={productItems}/>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default UserProfile