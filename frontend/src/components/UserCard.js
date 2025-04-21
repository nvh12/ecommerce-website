import React from 'react';

const UserCard = ({user}) => {
    return (
        <div className='row mx-3'>
                    <div className='col-4'>
                        <p>{user.name}</p>
                    </div>
                    <div className='col-4'>
                        <p>{user.email}</p>
                    </div>
                    <div className='col-2'>
                        <p>{user.role}</p>
                    </div>
                    <div className='col-auto col-md-2 d-flex flex-nowrap gap-2 mb-3'>
                        <button className='btn border'><i className="bi bi-pencil-fill"></i></button>
                        <button className='btn border'><i className="bi bi-trash2-fill"></i></button>
                    </div>
        </div>
        
    );
};

export default UserCard;