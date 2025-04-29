import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import UserProfileComponent from '../components/UserProfileComponent'
import { toast } from 'react-toastify'
import axios from 'axios'
import axiosInstance from '../utils/axiosInstance'

const UserProfile = () => {
  const {backendUrl, userData, setUserData, setIsLoggedIn, isLoggedIn } = useContext(AppContext)

  const [activeSection, setActiveSection] = useState("orders")
  const [userOrders, setUserOrders] = useState([])
  const [userCart, setUserCart] = useState([])
  const [page, setPage] = useState(1)

  const navigate = useNavigate()
  
  const handleMenuClick = (section) => {
    setActiveSection(section)
  }

  const onLogOutHandler = async (e) => {
    e.preventDefault()
    try {
      await axios.post(backendUrl + "/auth/logout", {}, { withCredentials: true })
  
      
      localStorage.removeItem("userData")
      localStorage.removeItem("isLoggedIn")
      // console.log(userData)
      // console.log(isLoggedIn)
  
      setUserData({})
      setIsLoggedIn(false)
      setUserOrders([])
  
      toast.success("Đăng xuất thành công")
      navigate('/')
    } catch (error) {
      console.log("Logout error:", error)
  toast.error("Lỗi đăng xuất: " + (error.response?.data?.error || error.message))
    }
  }

  const fetchUserOrders = async () => {
    console.log("page", page)
    try {
      const res = await axiosInstance.get(backendUrl + "/user/order", 
        {
          params: { page: page },
          withCredentials: true
        }
      )
      const temp = res.data.data
      console.log("don hang", temp.length) 
      setUserOrders(temp)
    } catch (error) {
      toast.error("Lỗi lấy đơn hàng")
    }
  }

  // const fetchUserCart = async () => {
  //   try {
  //     const res = await axios.get(backendUrl + "/cart", {withCredentials: true})
  //     console.log("Đã lấy giỏ hàng người dùng !")
  //     console.log(res.data)
  //     // setUserCart(res.data)
  //   } catch (error) {
  //     toast.error("Lỗi lấy giỏ hàng")
  //   }
  // }
  useEffect(() => { 
    fetchUserOrders()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])
  
  return (
    <div>
        <Header />
        <div className='container my-5'>
            <div className='row'>
                <div className='col-12 col-md-3 d-flex flex-column gap-2 border rounded'>
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
                      {/* <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('wallet')}>
                        <i className="bi bi-wallet-fill me-2"></i>
                        <span>Ví</span>
                      </button> */}
                      {/* <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('cart')}>
                        <i className="bi bi-basket3-fill me-2"></i>
                        <span>Giỏ hàng</span>
                      </button> */}
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={() => handleMenuClick('account')}>
                        <i className="bi bi-person-circle me-2"></i>
                        <span>Thông tin tài khoản</span>
                      </button>
                      {/* <button className='bg-transparent btn rounded-pill hover-style'>
                      <i className="bi bi-geo-alt-fill me-2"></i>
                        <span>Địa chỉ</span>
                      </button> */}
                      <button className='bg-transparent btn rounded-pill hover-style'
                      onClick={onLogOutHandler}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                </div>
                <div className='col-12 col-md-9 d-flex flex-column  p-3 border rounded'>
                      <UserProfileComponent activeSection={activeSection} userOrders={userOrders} userCart={userCart} page={page}/>
                      <div className='row'>
                        <button className='col-auto me-auto btn rounded-pill border ms-2'
                        onClick={() => {
                          setPage(page => page - 1)
                        }}
                        disabled={page === 1}>
                          Trang trước</button>
                        <button className='col-auto btn rounded-pill border me-2'
                        onClick={() => {
                          setPage(page => page + 1)
                        }}
                        disabled={userOrders.length < 20}>
                          Trang sau </button>
                      </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default UserProfile