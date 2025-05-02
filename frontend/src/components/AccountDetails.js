import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { toast } from "react-toastify"
import axios from "axios"

const AccountDetails = () => {
    const { userData, backendUrl, fetchUserData} = useContext(AppContext)
    const [email, setEmail] = useState("")  
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    useEffect(() => {
        if (userData) {
            setName(userData.name || "")
            setEmail(userData.email || "")
        }
    }, [userData])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            await axios.put(backendUrl + "/user/update", {
                updateData: {
                    name: name,
                    password: password
                }
            }, { withCredentials: true })
            fetchUserData()
            toast.success("Cập nhật thông tin thành công!")
        } catch (error) {
            toast.error("Lỗi cập nhật thông tin tài khoản")
        }
    }

    return (
        <div className="d-inline-block">
            <h2>Thông tin tài khoản</h2>
            <hr />
            <div className="my-3">
                <p className="fs-4 bold">Tên: </p>
                <input type="text" className="fs-5 text-muted border rounded form-control shadow-none outline-none"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="row my-3">
                <div className="col-md-6 col-12">
                    <p className="fs-4 bold">Địa chỉ Email: </p>
                    <input type="email" className="fs-5 text-muted border form-control rounded shadow-none outline-none"
                        value={email} readOnly/>
                </div>
                <div className="col-md-6 col-12">
                    <p className="fs-4 bold">Mật khẩu mới: </p>
                    <input type="password" className="fs-5 text-muted border form-control rounded shadow-none outline-none"
                        value={password}  placeholder="Nhập mật khẩu mới"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <button className='btn rounded-pill hover-style mt-4' style={{ backgroundColor: '#FFD400' }}
                onClick={onSubmitHandler}>
                Sửa thông tin
            </button>
        </div>
    )
}

export default AccountDetails
