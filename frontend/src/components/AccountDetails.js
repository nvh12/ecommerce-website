import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"

const AccountDetails = () => {
    const {userData} = useContext(AppContext)  

    const [email, setEmail] = useState("") // chưa lấy được name 
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            
        } catch (error) {
            toast.error("Lỗi cập nhật thông tin tài khoản")
        }
    }

    return (
        <>
            <div className="d-inline-block">
                <h2>Thông tin tài khoản</h2>
                <hr />
                <div className="my-3">
                    <p className="fs-4 bold">Tên: </p>
                    <input type="text" className="fs-5 text-muted border rounded form-control shadow-none outline-none" value={userData.name} 
                    onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="row my-3">
                    <div className="col-6">
                        <p className="fs-4 bold">Địa chỉ Email: </p>
                        <input type="email" className="fs-5 text-muted border form-control rounded shadow-none outline-none" value={userData.email} 
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="col-6">
                        <p className="fs-4 bold">Mật khẩu: </p>
                        <input type="password" className="fs-5 text-muted border form-control rounded shadow-none outline-none" value={userData.password} 
                        onChange={(e) => setPassword(e.target.value)}/></div>   
                    </div>   
                <button className='btn rounded-pill hover-style mt-4' style={{backgroundColor: '#FFD400'}}
                onClick={onSubmitHandler}>
                        Sửa thông tin
                </button> 
            </div>
        </>
    )
}

export default AccountDetails