import EditProfileNavbar from './components/EditProfileNavbar.js';
import CardComponent from './components/CardComponent.js';
import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home.js'
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import UserProfile from './pages/UserProfile.js';
import UserListPage from './pages/Admin/UserListPage.js';
     

function App() {
  return (
    <div>
      {/* <CardComponent 
        title="Card Title"
        description="This is a card description."
        image="https://urbox.vn/_next/image?url=https%3A%2F%2Fupload.urbox.vn%2Fstrapi%2Fsatrafoods_feature_image_98f77d5d6d_93fa2f031f.png&w=2048&q=75"
        button="Click Me"
      />
      <EditProfileNavbar
        key="edit-profile-navbar"
        className="edit-profile-navbar"
        style={{ marginBottom: '20px' }}
      /> */}
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/user' element={<UserProfile />} />
          <Route path='/admin/userlist' element={<UserListPage/>} />
      </Routes>
    </div>
  );
}

export default App;
