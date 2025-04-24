import React from 'react';
import PlacedOrderCard from './PlacedOrderCard';
import AccountDetails from './AccountDetails';
import Order from './Order';

const UserProfileComponent = ({ activeSection, userOrders, userCart }) => {
    switch (activeSection) {
        case "orders":
            return (
            <>
                <h2>Đơn hàng của tôi</h2>
                <hr />
                {Array.isArray(userOrders) && userOrders.length > 0 ? (
                    userOrders.map((dataOrder, index) => (
                        <Order key={index} indexOrder={index} dataOrder={dataOrder} />
                    ))
                ) : (
                    <p>Không có đơn hàng nào</p>
                )}
            </>);
        case "account":
            return <AccountDetails />;
        case "cart":
            return (
                <>
                    <h2>Giỏ hàng hàng của tôi</h2>
                    <hr />
                    {Array.isArray(userCart) && userCart.length > 0 ? (
                        userCart.map((dataOrder, index) => (
                            <PlacedOrderCard key={index} indexOrder={index} dataOrder={dataOrder} />
                        ))
                    ) : (
                        <p>Không có giỏ hàng nào</p>
                    )}
                </>
            );
        default:
            return <p>Chọn một mục trong menu bên trái để hiển thị nội dung</p>;
    }
};

export default UserProfileComponent;
