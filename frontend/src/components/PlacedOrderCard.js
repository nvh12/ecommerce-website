import React from 'react'

const PlacedOrderCard = ({indexOrder, dataOrder}) => {
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
            <div className='col-md-4 col-12' style={{height: '280px'}}>
              <img src={dataOrder.images[0]} alt="" 
              className='h-100 w-100 border'
              style={{ objectFit: 'cover', borderRadius: '8px'}}/>
            </div>
            <div className='col-md-8 col-12'>
              <div className='row'>
                <div className='col-auto me-auto'>
                  <p>{dataOrder.productName}</p>
                </div>
                <div className='col-auto'>
                  <p>Giá sản phẩm: </p><span>{dataOrder.price.toLocaleString('vi-VN')} {dataOrder.currency}</span>
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