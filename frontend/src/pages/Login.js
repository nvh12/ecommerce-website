import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const goToRegister = () => {
    navigate('/register')
  }
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-light text-black" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-black-50 mb-5">Please enter your login and password!</p>

                  <div className="form-outline form-white mb-4">
                    <input type="email" id="typeEmailX" className="form-control form-control-lg" placeholder="Email" />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input type="password" id="typePasswordX" className="form-control form-control-lg" placeholder="Password" />
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <a className="text-black-50" href="#!">Forgot password?</a>
                  </p>

                  <button className="btn btn-lg px-5 hover-style" type="submit" style={{backgroundColor: '#FFD400'}}>
                    Login
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="" className="text-black-50 fw-bold" onClick={goToRegister}>Sign Up</a>
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
