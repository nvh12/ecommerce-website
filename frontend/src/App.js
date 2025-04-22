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
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext.js';
     

function App() {
  return (
    <div>
      <ToastContainer />
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
