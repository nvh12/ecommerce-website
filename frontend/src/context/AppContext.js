import React, { createContext, useEffect, useState, useCallback } from 'react'
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
    const [product, setProduct] = useState(null)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [productError, setProductError] = useState(null)
    const [usersForAdmin, setUsersForAdmin] = useState([])
    const [ordersForAdmin, setOrdersForAdmin] = useState([])
    const [userOrders, setUserOrders] = useState([])

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const fetchUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + "/user", {withCredentials: true})
            setUserData(data.data)
            // console.log(userData)
            setIsLoggedIn(true)
            // console.log(isLoggedIn)
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
            toast.error("Lỗi khi tải thông tin sản phẩm")
        }
    }

    // Function to get a single product
    // const getProductById = (productId) => {
    //     console.log("Looking for product:", productId);
    //     console.log("Available products:", productItems);
    //     const foundProduct = productItems.find(product => product._id === productId);
    //     console.log("Found product:", foundProduct);
    //     return foundProduct;
    // };

    // Fetch product details
    const fetchProduct = useCallback(async (productId) => {
        if (!productId) return;
        
        //console.log('Starting to fetch product:', productId);
        setIsLoadingProduct(true);
        setProductError(null);
        
        try {
            const { data } = await axios.get(`${backendUrl}/product/${productId}`);
            //console.log('Raw response data:', data);
            
            if (data && data.product && Array.isArray(data.product) && data.product.length > 0) {
                const productFromResponse = data.product[0];
                //console.log('Product data from response:', productFromResponse);
                
                // Create a new object with the correct structure
                const productData = {
                    ...productFromResponse,
                    // Ensure numeric values are properly handled
                    price: Number(productFromResponse.price) || 0,
                    discount: Number(productFromResponse.discount) || 0,
                    stocks: Number(productFromResponse.stocks) || 0,
                    ratingsAvg: Number(productFromResponse.ratingsAvg) || 0,
                    ratingsCount: productFromResponse.ratingsCount || { total: 0 },
                    reviewsCount: Number(productFromResponse.reviewsCount) || 0
                };
                
                //console.log('Processed product data:', productData);
                setProduct(productData);
            } else {
                console.log('No valid product data in response');
                setProduct(null);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setProductError(error.response?.data?.message || 'Failed to fetch product');
            toast.error('Lỗi lấy chi tiết sản phẩm');
            setProduct(null);
        } finally {
            setIsLoadingProduct(false);
        }
    }, [backendUrl]);

    // Clear product data
    const clearProduct = () => {
        setProduct(null);
        setProductError(null);
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
        setProductItems,
        userData,
        setUserData,
        backendUrl,
        fetchUserData,
        setIsLoggedIn,
        isLoggedIn,
        fetchProductData,
        // getProductById,
        currentProduct,
        setCurrentProduct,
        loading,
        setLoading,
        product,
        isLoadingProduct,
        productError,
        fetchProduct,
        clearProduct,
        usersForAdmin, setUsersForAdmin,
        ordersForAdmin, setOrdersForAdmin,
        userOrders, setUserOrders
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider