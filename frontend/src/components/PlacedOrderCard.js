import React from 'react'

const PlacedOrderCard = ({indexOrder, dataOrder}) => {
  return (
    <>
      <div className='my-2'>
        <div className='row shadow p-3 rounded' >
          <div className='row mb-2'>
            <div className='col-auto me-auto'>
              <b>Đơn hàng: </b><span className=''>{indexOrder+1}</span>
            </div>
            <div className='col-auto me-0'>
              <b className='dangGiao'>Đang giao hàng</b>
            </div>
          </div>
          <hr />
          <div className='row mb-2'>
            <div className='col-3' style={{height: '150px'}}>
              <img src={dataOrder.images[0]} alt="" 
              className='h-100 w-100 border'
              style={{ objectFit: 'cover', borderRadius: '8px' }}/>
            </div>
            <div className='col-9'>
              <div className='row'>
                <div className='col-auto me-auto'>
                  <p>{dataOrder.productName}</p>
                </div>
                <div className='col-auto'>
                  <p>Tổng tiền: </p><span>{dataOrder.price.toLocaleString('vi-VN')} {dataOrder.currency}</span>
                </div>
              </div>
            </div>
          </div>
          <button className='bg-transparent btn rounded-pill hover-style' style={{backgroundColor: '#FFD400'}}>
              Xem chi tiết 
          </button>
        </div>
      </div>
    </>
  )
}

export default PlacedOrderCard