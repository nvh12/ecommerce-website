import { useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import axios from "axios"

const Register = () => {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")    

    const {backendUrl, fetchUserData} = useContext(AppContext)
    const goToLogin = () => {
        navigate('/login')
    }
    const onsubmitHandler = async (e) => {
        e.preventDefault()
        try {
            await axios.post(backendUrl + "/auth/register", {
                name, email, password
            })
            toast.success("Đăng ký thành công")
            fetchUserData()
            navigate('/login')
        } catch (error) {
            toast.error("Đăng ký không thành công")
        }
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
                    <form onSubmit={onsubmitHandler}>
                        <div className="row">
                            <div className="col-12 mb-4 pb-2">
                                <div className="form-outline">
                                <input type="text" id="name" className="form-control form-control-lg" placeholder="Name" 
                                onChange={(e) => setName(e.target.value)}/>
                            </div>
                        </div>
                        </div>
                        <div className="row">
                           <div className="col-12 mb-4 pb-2">
                                <div className="form-outline">
                                <input type="email" id="emailAddress" className="form-control form-control-lg" placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)}/>
                           </div>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-12 mb-4 pb-2">
                            <input type="password" id="typePassword" className="form-control form-control-lg" placeholder="Password" 
                            onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        </div>
                        <div>
                            <p className="mb-0">
                                Bạn đã có tài khoản?{" "}
                                <a href="" className="text-black-50 fw-bold" onClick={goToLogin}>Đăng nhập</a>
                            </p>
                        </div>                        
                        <div className="mt-4 pt-2">
                        <button className="btn btn-lg px-5 hover-style" style={{backgroundColor: '#FFD400'}} type="submit">Đăng kí</button>
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