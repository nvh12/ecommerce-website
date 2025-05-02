import React from 'react'

const Footer = () => {
  return (
    <div className='shadow'>
        <div className='container'>
            <div className='row'>
                <div className='col-auto d-flex flex-column gap-2 mb-5 me-auto'>
                    <h2 className='mt-3 mb-5'>EShop</h2>
                    <div className='d-flex gap-2'>
                    <i className="bi bi-telephone-fill"></i>
                    <a href="tel:0123456789"
                    className='text-muted text-decoration-none fs-6'>0123 456 789</a>
                    </div>
                    <div className='d-flex gap-2'>
                    <i className="bi bi-envelope-fill"></i>
                    <a href="tel:0123456789"
                    className='text-muted text-decoration-none fs-6'>information@gmail.com</a>
                    </div>
                    <div className='d-flex gap-2'>
                    <i className="bi bi-geo-alt-fill"></i>
                    <a href="https://maps.app.goo.gl/8f8Yk9t4vJDQVCDd7"
                    className='text-muted text-decoration-none fs-6'>1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</a>
                    </div>
                </div>
                <div className='col-auto d-flex flex-column gap-2 mb-5 me-5'>
                    <h2 className='mt-3 mb-5'>Theo dõi chúng tôi</h2>
                    <div className='d-flex gap-2'>
                        <i className="bi bi-facebook"></i>
                        <span className='text-muted '>Facebook</span>
                    </div>
                    <div className='d-flex gap-2'>
                    <i className="bi bi-instagram"></i>
                        <span className='text-muted '>Instagram</span>
                    </div>
                    <div className='d-flex gap-2'>
                        <i className="bi bi-threads"></i>
                        <span className='text-muted '>Thread</span>
                    </div>
                </div>
            </div>
            <hr className="" />
            <div className="row small">
            <div className="col-md-6 text-md-start text-center text-muted">
                © 2025 E-Shop. Bản quyền đã đăng kí.
            </div>
            <div className="col-md-6 text-md-end text-center mb-5">
                <a href="#" className="text-muted text-decoration-none me-2">Chính sách bảo mật</a> |
                <a href="#" className="text-muted text-decoration-none mx-2">Điều khoản &amp; Điều kiện</a> |
                <a href="#" className="text-muted text-decoration-none ms-2">Sitemap</a>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Footer