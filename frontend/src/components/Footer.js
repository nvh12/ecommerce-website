import React from 'react'

const Footer = () => {
  return (
    <div className='shadow'>
        <div className='container'>
            <div className='row'>
                <div className='col-auto d-flex flex-column gap-2 mb-5 me-auto'>
                    <h2 className='mt-3 mb-5'>EShop</h2>
                    <div className='d-flex gap-2'>
                    <i class="bi bi-telephone-fill"></i>
                    <a href="tel:0123456789"
                    className='text-muted text-decoration-none fs-6'>0123 456 789</a>
                    </div>
                    <div className='d-flex gap-2'>
                    <i class="bi bi-envelope-fill"></i>
                    <a href="tel:0123456789"
                    className='text-muted text-decoration-none fs-6'>information@gmail.com</a>
                    </div>
                    <div className='d-flex gap-2'>
                    <i class="bi bi-geo-alt-fill"></i>
                    <a href="https://maps.app.goo.gl/8f8Yk9t4vJDQVCDd7"
                    className='text-muted text-decoration-none fs-6'>1 Dai Co Viet, Hai Ba Trung, Ha Noi</a>
                    </div>
                </div>
                <div className='col-auto d-flex flex-column gap-2 mb-5 me-5'>
                    <h2 className='mt-3 mb-5'>Follow Us</h2>
                    <div className='d-flex gap-2'>
                        <i class="bi bi-facebook"></i>
                        <span className='text-muted '>Facebook</span>
                    </div>
                    <div className='d-flex gap-2'>
                    <i class="bi bi-instagram"></i>
                        <span className='text-muted '>Instagram</span>
                    </div>
                    <div className='d-flex gap-2'>
                        <i class="bi bi-threads"></i>
                        <span className='text-muted '>Thread</span>
                    </div>
                </div>
            </div>
            <hr class="" />
            <div class="row small">
            <div class="col-md-6 text-md-start text-center text-muted">
                © 2025 E-Shop. All Rights Reserved.
            </div>
            <div class="col-md-6 text-md-end text-center mb-5">
                <a href="#" class="text-muted text-decoration-none me-2">Privacy Policy</a> |
                <a href="#" class="text-muted text-decoration-none mx-2">Terms &amp; Condition</a> |
                <a href="#" class="text-muted text-decoration-none ms-2">Sitemap</a>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Footer