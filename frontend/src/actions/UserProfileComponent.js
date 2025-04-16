import React from 'react';
import PlacedOrderCard from '../components/PlacedOrderCard';
import AccountDetails from '../components/AccountDetails';

const UserProfileComponent = ({activeSection, productItems}) => {
    switch (activeSection) {
        case "orders" :
            return (
                <>
                    <h2>Đơn hàng của tôi</h2>
                    <hr/>
                    {productItems.map((dataOrder, index) => (
                        <PlacedOrderCard key={index} indexOrder={index} dataOrder={dataOrder}/>
                    ))}    
                </>
            )
        case "account" :
            return (
                <AccountDetails />
            )
        default:
            return <p>Chọn một mục trong menu bên trái để hiển thị nội dung</p>;
    }
};

export default UserProfileComponent;