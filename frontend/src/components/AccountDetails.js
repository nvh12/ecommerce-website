const AccountDetails = () => {
    return (
        <>
            <div className="d-inline-block">
                <h2>Thông tin tài khoản</h2>
                <hr />
                <div className="my-3">
                    <p className="fs-4 bold">Tên: </p>
                    <input type="text" className="fs-5 text-muted border rounded form-control shadow-none outline-none" value={'password'} />
                </div>
                <div className="row my-3">
                    <div className="col-6">
                        <p className="fs-4 bold">Địa chỉ Email: </p>
                        <input type="email" className="fs-5 text-muted border form-control rounded shadow-none outline-none" value={'password'} />
                    </div>
                    <div className="col-6">
                        <p className="fs-4 bold">Mật khẩu: </p>
                        <input type="password" className="fs-5 text-muted border form-control rounded shadow-none outline-none" value={'password'} /></div>   
                    </div>   
                <button className='btn rounded-pill hover-style mt-4' style={{backgroundColor: '#FFD400'}}>
                        Sửa thông tin
                </button> 
            </div>
        </>
    )
}

export default AccountDetails