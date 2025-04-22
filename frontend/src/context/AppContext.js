import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
    const [productItems, setProductItems] = useState([])
    const [userData, setUserData] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const fetchUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + "/user", {withCredentials: true})
            setUserData(data)
            console.log(data)
            setIsLoggedIn(true)
            console.log(isLoggedIn)
        } catch (error) {
            toast.error("Lỗi lấy thông tin người dùng")
        }
    }

    //lấy tất cả product 
    const fetchProductData = async () => {
        try {
            const {data} = await axios.get(backendUrl + "/product")
            if(data.success) {
                setProductItems(data.product)
            } else {
                toast.error("Lỗi lấy sản phẩm")
            }
            setProductItems(data.product)
        } catch (error) {
            toast.error(error.message)
        }
    }

    // useEffect(()=> {
    //     fetchUserData()
    // }, [])


    const value = {
        productItems, userData,
        backendUrl, fetchUserData,
        setIsLoggedIn, isLoggedIn,
        fetchProductData,
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider