import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import PlacedOrderCard from './PlacedOrderCard'

const Order = ({indexOrder, dataOrder}) => {
    const {backendUrl} = useContext(AppContext)
    const [orderDetail, setOrderDetail] = useState([])
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    const fetchOrderDetail = async () => {
        // console.log("dataOrder", dataOrder) //id đơn hàng
        const idList = dataOrder.items.map(item => item.product)
        //console.log("idList", idList) //danh sách id sản phẩm được mua của 1 đơn
        const dataList = await Promise.all( 
            idList.map(id =>
                axios
                    .get(`${backendUrl}/product/${id}`)
                    .then(res => res.data.product[0])
            )
        )
        // console.log("dataList", dataList) //danh sách id sản phẩm được mua của 1 đơn 
        setOrderDetail(dataList)
         //danh sách id sản phẩm được mua của 1 đơn
    }
    useEffect(() => {
        fetchOrderDetail()
        console.log("orderDetail", orderDetail.address) //id đơn hàng
    }, [])

  return (
    <>
    <div className='mb-5 shadow rounded p-3'>
    <div className='row mb-2'>
            <div className='col-auto me-auto'>
              <b>Đơn hàng: </b><span className=''>{dataOrder._id}</span>
            </div>
            <div className='col-auto me-0'>
              <b className='dangGiao'>{dataOrder.status}</b>
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
                        <p>{item.productName}</p>
                    )}
                </div>
                <div className='col-auto'>
                  <p>Tổng tiền: </p><span>{`${dataOrder.total_price.toLocaleString('vi-VN')} VND`}</span>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
    :
    <>
      {
        orderDetail.map((dataOrder, index) => (
            <PlacedOrderCard key={index} indexOrder={index} dataOrder={dataOrder} />
        ))
      }
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