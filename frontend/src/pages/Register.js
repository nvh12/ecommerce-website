import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
    const goToLogin = () => {
        navigate('/login')
    }

    return (
    <section className="bg-light vh-100 gradient-custom">
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-lg-9 col-xl-7">
                <div
                className="card shadow-2-strong card-registration"
                style={{ borderRadius: 15 }}
                >
                <div className="card-body p-4 p-md-5">
                    <h2 className="fw-bold text-uppercase mb-4">Sign up</h2>
                    <form>
                        <div className="row">
                            <div className="col-12 mb-4 pb-2">
                                <div className="form-outline">
                                <input type="text" id="name" className="form-control form-control-lg" placeholder="Name" />
                            </div>
                        </div>
                        </div>
                        <div className="row">
                           <div className="col-12 mb-4 pb-2">
                                <div className="form-outline">
                                <input type="email" id="emailAddress" className="form-control form-control-lg" placeholder="Email" />
                           </div>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-12 mb-4 pb-2">
                            <input type="password" id="typePassword" className="form-control form-control-lg" placeholder="Password" />
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-12 mb-4 pb-2">
                            <input type="password" id="typeConfirmPassword" className="form-control form-control-lg" placeholder="Confirm Password" />
                        </div>
                        </div>
                        <div className="mt-4 pt-2">
                        <button className="btn btn-lg px-5 hover-style" style={{backgroundColor: '#FFD400'}}
                        onClick={goToLogin}>Sign Up</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>
    )
}

export default Register