import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
    const [productItems, setProductItems] = useState([])
    const [userData, setUserData] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const backendUrl = "http://localhost:5000"

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
            if (data.message === "Success") {
                setProductItems(data.product)
                console.log("Products loaded:", data.product)
                toast.success("Lấy sản phẩm thành công")
            } else {
                toast.error("Lỗi lấy sản phẩm")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to get a single product
    const getProductById = (productId) => {
        console.log("Looking for product:", productId);
        console.log("Available products:", productItems);
        const foundProduct = productItems.find(product => product._id === productId);
        console.log("Found product:", foundProduct);
        return foundProduct;
    };

    useEffect(() => {
        fetchProductData()
    }, [])

    const value = {
        productItems,
        userData,
        backendUrl,
        fetchUserData,
        setIsLoggedIn,
        isLoggedIn,
        fetchProductData,
        getProductById
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider