import React, { useContext, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import UserProfileComponent from '../actions/UserProfileComponent'

const UserProfile = () => {
  const { productItems, userData } = useContext(AppContext)
  const user = userData[0] //mẫu 

  const [activeSection, setActiveSection] = useState("account")
  
  const handleMenuClick = (section) => {
    setActiveSection(section)
  }
  return (
    <div>
        <Header />
        <div className='container my-5'>
            <div className='row'>
                <div className='col-3 d-flex flex-column gap-2 border rounded'>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <img src="https://picsum.photos/200/300" alt="" 
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        className='w-50 h-50 mb-2'/>
                        <p className='fs-2 m-0'>Username</p>
                        <p className='text-muted small m-0'>username@gmail.com</p>
                    </div>
                    <hr />
                    <div className='d-flex flex-column align-items-start gap-1 mb-2'>
                      <button className='d-inline-block bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('orders')}>
                        <i class="bi bi-inboxes-fill me-2"></i>
                        <span>Đơn hàng</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('wallet')}>
                        <i class="bi bi-wallet-fill me-2"></i>
                        <span>Ví</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('cart')}>
                        <i class="bi bi-basket3-fill me-2"></i>
                        <span>Giỏ hàng</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('account')}>
                        <i class="bi bi-person-circle me-2"></i>
                        <span>Thông tin tài khoản</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'>
                      <i class="bi bi-geo-alt-fill me-2"></i>
                        <span>Địa chỉ</span>
                      </button>
                      <button className='bg-transparent btn rounded-pill hover-style'>
                        <i class="bi bi-box-arrow-right me-2"></i>
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