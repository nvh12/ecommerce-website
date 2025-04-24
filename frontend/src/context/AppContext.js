import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
    const [productItems, setProductItems] = useState([])
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });
    
    const [currentProduct, setCurrentProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    // const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const backendUrl = "http://localhost:5000"

    const fetchUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + "/user", {withCredentials: true})
            setUserData(data.data)
            console.log(userData)
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
                // console.log("Products loaded:", data.product)
                //toast.success("Lấy sản phẩm thành công")
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
    useEffect(() => {
        // khi userData thay đổi, lưu vào localStorage
        if (userData && Object.keys(userData).length > 0) {
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("userData");
            localStorage.removeItem("isLoggedIn");
        }
    }, [userData, isLoggedIn]);
    

    const value = {
        productItems,
        userData,
        setUserData,
        backendUrl,
        fetchUserData,
        setIsLoggedIn,
        isLoggedIn,
        fetchProductData,
        getProductById,
        currentProduct,
        setCurrentProduct,
        loading,
        setLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider