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
        const idList = dataOrder.items.map(item => item.product)
        const dataList = await Promise.all( 
            idList.map(id =>
                axios
                    .get(`${backendUrl}/product/${id}`)
                    .then(res => res.data.product[0])
            )
        )
        setOrderDetail(dataList)
    }
    useEffect(() => {
        fetchOrderDetail()
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
                  <p>Tổng tiền: </p><span>{dataOrder.total_price.toLocaleString('vi-VN')}</span>
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
    <button className='bg-transparent btn rounded-pill hover-style' style={{backgroundColor: '#FFD400'}}
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