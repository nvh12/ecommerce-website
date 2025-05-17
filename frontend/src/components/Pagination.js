import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { Button } from 'react-bootstrap'
const Pagination = ({ pageName, setItems, category, brand, 
    activeSearchByName, filterUserName,
    updateOrders}) => {
    const { backendUrl, productItems, setProductItems, setUsersForAdmin, setOrdersForAdmin } = useContext(AppContext)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()
    // console.log(pageName)
    const fetchTotalPages = async () => {
        switch (pageName) {
            case "productsPage":
                try {
                    const res = await axiosInstance.get(`${backendUrl}/product/page`,
                        {
                            params: {
                                limit: 16,
                                category,
                                brand
                            }
                        },
                        {
                            withCredentials: true
                        }
                    )
                    setTotalPages(res.data.page.totalPages)

                    // console.log(res.data.page.totalPages)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "recommendationPage":
                try {
                    const res = await axiosInstance.get(`${backendUrl}/product/page`,
                        {
                            params: {
                                limit: 18
                            }
                        },
                        {
                            withCredentials: true
                        }
                    )
                    setTotalPages(res.data.page.totalPages)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "usersForAdmin":
                try {
                    if(filterUserName === "") {
                        const res1 = await axiosInstance.get(`${backendUrl}/admin/user`, { withCredentials: true })
                        setCurrentPage(1)
                        setTotalPages(res1.data.totalPages)
                    } else {
                        const res1 = await axiosInstance.get(`${backendUrl}/admin/user`, {
                            params: {name: filterUserName},
                            withCredentials: true
                        })
                        setCurrentPage(1)
                        setTotalPages(res1.data.totalPages)
                    }
                    // console.log("totalPages", res1.data.totalPages)                
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "ordersForAdmin":
                try {
                    const res2 = await axiosInstance.get(`${backendUrl}/admin/order`, { withCredentials: true })
                    setTotalPages(res2.data.totalPages)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "phonePage":
                try {
                    const res = await axios.get(`${backendUrl}/product/page`, {
                        params: {
                            category: 'Điện thoại',
                            limit: 18
                        }
                    })
                    setTotalPages(res.data.page.totalPages)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "laptopPage":
                try {
                    const res = await axios.get(`${backendUrl}/product/page`, {
                        params: {
                            category: 'Laptop',
                            limit: 18
                        }
                    })
                    setTotalPages(res.data.page.totalPages)
                } catch (error) {
                    console.log(error.message)
                }
                break
            default:
                break
        }
    }
    const fetchDataByPage = async () => {
        switch (pageName) {
            case "productsPage":
                try {
                    const res = await axios.get(`${backendUrl}/product`, {
                        params: {
                            category,
                            brand,
                            page: currentPage,
                            limit: 16
                        }
                    })
                    setProductItems(res.data.product)
                    setItems(res.data.product);
                    console.log(res.data.product)
                    console.log(currentPage)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "recommendationPage":
                try {
                    const res = await axios.get(`${backendUrl}/product`, {
                        params: {
                            page: currentPage,
                            limit: 18
                        }
                    })
                    // Use the setItems prop if provided, otherwise fall back to the context
                    if (setItems) {
                        setItems(res.data.product)
                    } else {
                        setProductItems(res.data.product)
                    }
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "usersForAdmin":
                try {
                    if(filterUserName !== "") {
                        const res1 = await axiosInstance.get(`${backendUrl}/admin/user`, {
                            params: { page: currentPage, name: filterUserName },
                            withCredentials: true
                        })
                    setUsersForAdmin(res1.data.user)
                    } else {
                        const res1 = await axiosInstance.get(`${backendUrl}/admin/user`, {
                            params: { page: currentPage},
                            withCredentials: true
                        })
                    setUsersForAdmin(res1.data.user)
                    }
                    // console.log(res1.data.user)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "ordersForAdmin":
                try {
                    const res2 = await axiosInstance.get(`${backendUrl}/admin/order`, {
                        params: { page: currentPage },
                        withCredentials: true
                    })
                    const temp = res2.data.data
                    const fetchOrdersWithUser = async () => {
                        const ordersWithUser = await Promise.all(
                            temp.map(async (order) => {
                                const userRes = await axiosInstance.get(`${backendUrl}/admin/user/${order.user}`, {
                                    withCredentials: true
                                })
                                return {
                                    ...order,
                                    user: userRes.data
                                }
                            })
                        )
                        //console.log("orderwithuser",ordersWithUser)
                        setOrdersForAdmin(ordersWithUser)
                    }
                    fetchOrdersWithUser()

                    // setOrdersForAdmin(temp)
                    // console.log(temp)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "phonePage":
                try {
                    const res = await axios.get(`${backendUrl}/product`, {
                        params: {
                            page: currentPage,
                            category: 'Điện thoại',
                            limit: 18
                        }
                    })
                    setProductItems(res.data.product)
                } catch (error) {
                    console.log(error.message)
                }
                break
            case "laptopPage":
                try {
                    const res = await axios.get(`${backendUrl}/product`, {
                        params: {
                            page: currentPage,
                            category: 'Laptop',
                            limit: 18
                        }
                    })
                    setProductItems(res.data.product)
                } catch (error) {
                    console.log(error.message)
                }
                break
            default:
                break
        }
        // // console.log("productItmes", productItems)
        // console.log("currentpage" ,currentPage)
    }

    useEffect(() => {
        fetchTotalPages()
    }, [activeSearchByName])
    useEffect(() => {
        fetchDataByPage()
    }, [currentPage, activeSearchByName, updateOrders])

    return (
        <>
            <div className='d-flex justify-content-center p-3 my-3'>
                <button className='btn rounded'
                    onClick={() => {
                        setCurrentPage(1)
                    }}
                    disabled={currentPage === 1}
                ><i className="bi bi-chevron-double-left"></i></button>
                <button className='btn rounded'
                    onClick={() => {
                        setCurrentPage(currentPage => currentPage - 1)
                    }}
                    disabled={currentPage === 1}
                ><i className="bi bi-chevron-left"></i>
                </button>


                {/* {totalPages == 1 && <button className='btn rounded' style={{ backgroundColor: "#FFD400" }}>1</button>}
                {totalPages == 2 &&
                    <>
                        <button className='btn rounded' style={currentPage == 1 ? { backgroundColor: "#FFD400" } : {}} onClick={() => setCurrentPage(1)}>1</button>
                        <button className='btn rounded' style={currentPage == 2 ? { backgroundColor: "#FFD400" } : {}} onClick={() => setCurrentPage(2)}>2</button>
                    </>}
                {totalPages > 2 &&
                    <>
                        <button className='btn rounded' onClick={() => setCurrentPage(currentPage)} style={{ backgroundColor: "#FFD400" }}>{currentPage}</button>
                        <button className='btn rounded' onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}>{currentPage + 1}</button>
                        <button className='btn rounded' onClick={() => setCurrentPage(currentPage + 2)}
                            disabled={currentPage >= totalPages - 1}>{currentPage + 2}</button>
                    </>} */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        className="mx-1"
                        style={currentPage === page ? { backgroundColor: '#FFD400' } : {}}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Button>
                ))}

                <button className='btn rounded'
                    onClick={() => {
                        setCurrentPage(currentPage => currentPage + 1)
                    }}
                    disabled={currentPage >= totalPages}
                ><i className="bi bi-chevron-right"></i>
                </button>
                <button className='btn rounded'
                    onClick={() => {
                        setCurrentPage(totalPages)
                    }}
                    disabled={currentPage >= totalPages}
                ><i className="bi bi-chevron-double-right"></i>
                </button>
            </div>
        </>
    )
};
export default Pagination