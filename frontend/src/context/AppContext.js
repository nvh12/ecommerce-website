import React, { createContext, useEffect, useState } from 'react'
import dataApi from '../apis/productApi'

export const AppContext = createContext(null)

const AppContextProvider = (props) => {
    const [productItems, setProductItems] = useState([])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await dataApi.getProducts();
                setProductItems(data);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm: ", error);
            }
        };
        fetchProduct();
    }, []);    

    const value = {
        productItems
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider