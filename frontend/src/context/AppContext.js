import React, { createContext, useEffect, useState } from 'react'
import dataApi from '../apis/productApi'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
    const [productItems, setProductItems] = useState([])
    const [userData, setUserData] = useState([])
    const mau = [{ 
        _id: "67e90ba169f6b16b579ceecb",
        name: "test",
        email: "test@mail.com",
        password: "$2b$10$5u/yusHzBD1k7DWn8N3I..Q2riqLzHEjO0yBBrsBgwDZCBWG3xXni",
        role: "user",
        createdAt: "2025-03-30T09:15:13.213Z",
        updatedAt: "2025-03-30T09:15:13.213Z",
        __v: 0
    }] //mẫu 
    
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await dataApi.getProducts();
                setProductItems(data);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm: ", error);
            }
        };
        const fetchUser = async () => {
            try {
                const data = await dataApi.getUsers()
                setUserData(data)
            } catch (error) {
                console.error("Lỗi lấy thông tin người dùng: ", error);
            }
        }
        fetchProduct();
        //fetchUser()
        setUserData(mau)
    }, []);    

    const value = {
        productItems, userData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider