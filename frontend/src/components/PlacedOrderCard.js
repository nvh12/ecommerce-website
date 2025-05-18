import React from 'react'

const PlacedOrderCard = ({indexOrder, dataOrder, quantity}) => {
  return (
    <>
      <div className='my-2'>
        <div className='row shadow p-3 rounded' >
          <div className='row mb-2'>
            <div className='col-auto me-auto'>
              <b>Sản phẩm: </b><span className=''>{indexOrder+1}</span>
            </div>
          </div>
          <hr />
          <div className='row mb-2'>
            { dataOrder?.images[0] &&
            <img src={dataOrder.images[0]} alt="" 
            className='col-md-4 col-12'
            style={{ objectFit: 'cover', borderRadius: '8px'}}/>}
            <div className='col-md-8 col-12'>
              <div className='row'>
                <div className='col-auto me-auto'>
                  <p>{dataOrder ? dataOrder.productName : "Sản phẩm này không tồn tại"}</p>
                  <small>Số lượng: {quantity}</small>
                </div>
                <div className='col-auto'>
                  <p>Giá sản phẩm: </p><span>{dataOrder ? dataOrder.price.toLocaleString('vi-VN') : "..."} {dataOrder?.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlacedOrderCard