import React from 'react';
import AccountDetails from './AccountDetails';
import Order from './Order';

const UserProfileComponent = ({ activeSection, userOrders =[], userCart, page, setUpdateUserOrder, updateUserOrder }) => {
    switch (activeSection) {
        case "orders":
            return (
            <>
                <h2>Đơn hàng của tôi</h2>
                <hr />
                {Array.isArray(userOrders) && userOrders.length > 0 ? (
                    userOrders.map((dataOrder, index) => (
                        <Order key={index} indexOrder={index} dataOrder={dataOrder} page={page} setUpdateUserOrder={setUpdateUserOrder} updateUserOrder={updateUserOrder}/>
                    ))
                ) : (
                    <p>Không có đơn hàng nào</p>
                )}
            </>);
        case "account":
            return <AccountDetails />;
        default:
            return <p>Chọn một mục trong menu bên trái để hiển thị nội dung</p>;
    }
};

export default UserProfileComponent;
