import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import UserCard from '../../components/UserCard';

const UserListPage = () => {
    const {userData} = useContext(AppContext)
    return (
        <div className='container'>
            <h1>Danh sách người dùng</h1>
            <hr />
            <div className='shadow rounded mt-4'>
                <div className='row justify-content-end p-3 mb-2'>
                    <div className='col-md-3 col-12'>
                        <div className='input-group flex-nowrap rounded bg-white'>
                            <button className='btn'><i class="bi bi-search"></i></button>
                            <input type='text' 
                            className='form-control rounded shadow-none outline-none'/>
                        </div>
                    </div>
                </div>
                <hr className='mx-3 border border-3 opacity-100'/>
                <div className='row mx-3 my-2'>
                    <div className='col-4'>
                        <b>Tên</b>
                    </div>
                    <div className='col-4'>
                        <b>Email</b>
                    </div>
                    <div className='col-1'>
                        <b>Vai trò</b>
                    </div>
                    
                </div>
                <div>
                    {
                        userData.map((user, index) => (
                            <>
                                <UserCard key={index} user={user}/>
                                <UserCard key={index} user={user}/>
                                <UserCard key={index} user={user}/>
                                <UserCard key={index} user={user}/>
                            </>
                        ))
                    }
                </div> 
            </div> 
        </div>
    );
};

export default UserListPage;