import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import PlacedOrderCard from './PlacedOrderCard'
import { toast } from 'react-toastify'
import axiosInstance from '../utils/axiosInstance'

const Order = ({indexOrder, dataOrder, page, setUpdateUserOrder, updateUserOrder}) => {
    const {backendUrl} = useContext(AppContext)
    const [orderDetail, setOrderDetail] = useState([])
    const [quantityList, setQuantityList] = useState([])
    const [show, setShow] = useState(false)

    const fetchOrderDetail = async () => {
        //console.log("dataOrder", dataOrder) //thông tin 1 đơn hàng
        const idList = dataOrder.items.map(item => item.product)
        const quantityListTest = dataOrder.items.map(item => item.quantity)
        setQuantityList(quantityListTest)
        // console.log("quantityList",quantityList)
        //console.log("idList", idList) //danh sách id sản phẩm được mua của 1 đơn
        const dataList = await Promise.all( 
            idList.map(id =>
                axios
                    .get(`${backendUrl}/product/${id}`)
                    .then(res => res.data.product[0])
            )
        )
        // console.log("dataList", dataList) //danh sách sản phẩm được mua của 1 đơn 
        setOrderDetail(dataList)
         //danh sách sản phẩm được mua của 1 đơn
    }
    const handleUpdateOrderDetail = async (status) => { 
      if (status === "completed") {
        const confirmed = window.confirm("Bạn chắc chắn đã nhận đơn hàng này?");
        if (!confirmed) {
          return
        }
      } else if (status === "cancelled") {
        const confirmed = window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?");
        if (!confirmed) {
          return
        }
      } 
      try {
        await axiosInstance.put(`${backendUrl}/user/order/${dataOrder._id}`, {updateData: {status: status}}, {withCredentials: true})
        toast.success("Cập nhật đơn hàng thành công")
        // window.location.reload();
        setUpdateUserOrder(!updateUserOrder)
      } catch (error) {
        toast.error("Lỗi cập nhật đơn hàng")
      }
    }
    useEffect(() => {
        fetchOrderDetail()
    }, [])

  return (
    <>
    <div className='mb-5 shadow rounded p-3'>
    <div className='row mb-2'>
            <div className='col-auto me-auto'>
              <b>Đơn hàng {(page-1)*20 + indexOrder + 1}: </b><span className=''>{dataOrder._id}</span>
            </div>
            <div className='col-auto me-0'>
              <b className='dangGiao'>{(dataOrder.status === "processing" && dataOrder.delivery === "delivery") && "Đang giao hàng"}</b>
              <b className='daNhan'>{dataOrder.status === "completed" && "Đã nhận hàng"}</b>
              <b className='daHuy'>{dataOrder.status === "cancelled" && "Đã hủy đơn hàng"}</b>
              <b className='nhanTaiCuaHang'>{dataOrder.delivery === "store" && dataOrder.status === "processing" && "Nhận tại cửa hàng"}</b>
            </div>
    </div>
    <div className='d-flex gap-2 mb-1'>
        <p className='m-0'>Ngày đặt hàng: </p>
        <span className='m-0'>{(new Date(dataOrder.createdAt)).toLocaleString("vi-VN")}</span>
    </div>
    {
      dataOrder.address ?
      <>
        <div className='d-flex gap-2 mb-2'>
          <p className='m-0'>Ngày giao hàng dự kiến: </p>
          <span className='m-0'>
            {
              new Date(new Date(dataOrder.createdAt).setDate(new Date(dataOrder.createdAt).getDate() + 3))
                .toLocaleDateString('vi-VN')
            }
          </span>
        </div>
        <div className='d-flex gap-2'>
          <p>Địa chỉ giao hàng: </p>
          <span>{dataOrder.address}</span>
        </div>
      </>
      :
      <>
        <div>
          <p>Nhận hàng trực tiếp tại cửa hàng</p>
        </div>
      </>
    }
          <hr />
    {!show ?
    <>
      <div className='my-2'>
        <div className='row p-3 rounded' >
          <div className='row mb-2'>
              <div className='row'>
                <div className='col-auto me-auto'>
                    {orderDetail.map((item, index) => 
                        <div key={index} className='mb-3'>
                          <p className='my-0'>{item.productName}</p>
                          <small className=''>Số lượng: {quantityList[index]}</small>
                        </div>
                    )}
                </div>
                <div className='col-auto'>
                  <p>Tổng tiền: </p><span>{`${dataOrder.total_price.toLocaleString('vi-VN')} VND`}</span>
                </div>
              </div>
          </div>
        </div>
      { dataOrder.status === "completed" || dataOrder.status === "cancelled" ?
        <></>
        :
        <div className='d-flex gap-2 my-2'>
          <button className='btn btn-outline-success rounded-pill'
          onClick={() => {
            handleUpdateOrderDetail("completed")
          }}>Đã nhận đơn hàng</button>
          <button className='btn btn-outline-danger rounded-pill'
          onClick={() => {
            handleUpdateOrderDetail("cancelled")
          }}>Hủy đơn hàng</button>
        </div> 
      }               
      </div>
    </>
    :
    <>
      {
        orderDetail.map((dataOrder, index) => (
            <PlacedOrderCard key={index} indexOrder={index} dataOrder={dataOrder} quantity={quantityList[index]}/>
        ))
      }
      <div className='row justify-content-end me-2 my-3'>
        <div className='col-auto'>
          <p className='my-0'>Tổng tiền: </p><span>{`${dataOrder.total_price.toLocaleString('vi-VN')} VND`}</span></div>
      </div>
    </>
    } 

    <button className='btn rounded-pill hover-style my-2' style={{backgroundColor: '#FFD400'}}
          onClick={() => setShow(!show)}>
            {!show ?
              "Xem chi tiết"
            :
              "Ẩn chi tiết"
            }  
    </button>
    </div>
    </>
  )
}

export default Order