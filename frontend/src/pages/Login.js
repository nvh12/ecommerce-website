import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const {backendUrl, fetchUserData, userData, setUserData, isLoggedIn, setIsLoggedIn} = useContext(AppContext)

  const goToRegister = () => {
    navigate('/register')
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.post(backendUrl + "/auth/login", {identifier, password}, 
        {withCredentials: true})
      await fetchUserData()
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Thông tin đăng nhập sai!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }
  }

  useEffect(() => { 
    // console.log(isLoggedIn)
    // console.log(userData)
    if(userData.role === "admin" && isLoggedIn) {
      navigate('/admin')
      toast.success("Đăng nhập thành công với quyền admin")
    }
    else if (userData.role === "user" && isLoggedIn) {
      navigate('/user')
      toast.success("Đăng nhập thành công")
    }
  }, [isLoggedIn, userData])
  
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-light text-black" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Đăng Nhập</h2>
                  <p className="text-black-50 mb-5">Vui lòng nhập email và mật khẩu!</p>

                  <form onSubmit={onSubmitHandler}>
                    <div className="form-outline form-white mb-4">
                      <input type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Email" 
                      onChange={(e) => setIdentifier(e.target.value)}/>
                    </div>
  
                    <div className="form-outline form-white mb-4">
                      <input type="password" id="typePasswordX" className="form-control form-control-lg" placeholder="Mật khẩu" 
                      onChange={(e) => setPassword(e.target.value)}/>
                    </div>
  
                    <button className="btn btn-lg px-5 hover-style" type="submit" style={{backgroundColor: '#FFD400'}}>
                      Đăng Nhập
                    </button>
                  </form>
                </div>

                <div>
                  <p className="mb-0">
                    Bạn chưa có tài khoản?{" "}
                      <button className="btn btn-link text-black-50 fw-bold p-0" onClick={goToRegister}>
                        Đăng Ký
                      </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
