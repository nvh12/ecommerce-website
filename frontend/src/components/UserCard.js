import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const UserCard = ({user}) => {
    const navigate = useNavigate()
    const {backendUrl} = useContext(AppContext)
    console.log("user", user._id)

    const fetchSingleOrder = async () => {
        try {
            const res = await axios.get(`${backendUrl}/user/order/${user._id}`)
            console.log("res", res.data)
        } catch (error) {
            console.log("Lỗi lấy đơn hàng", error)
        }
    }

    // useEffect(() => {
    //     fetchSingleOrder()
    // }, [])
    return (
        <div className='row mx-3'>
                    <div className='col-4'>
                        <p>{user.name}</p>
                    </div>
                    <div className='col-5'>
                        <p>{user.email}</p>
                    </div>
                    <div className='col-2'>
                        <p>{user.role}</p>
                    </div>
                    <div className='col-1 text-center'>
                        <button className='btn'
                        onClick={() => navigate('/test')}>
                            <i className="bi bi-three-dots"></i>
                        </button>
                    </div>
        </div>
        
    );
};

export default UserCard;