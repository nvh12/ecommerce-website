import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home.js'
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import UserProfile from './pages/UserProfile.js';
import UserListPage from './pages/Admin/UserListPage.js';
import ProductListPage from './pages/Admin/ProductListPage.js';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react';
import { AppContext } from './context/AppContext.js';
import NavbarComponent from './components/Navbar.js';
import Header from './components/Header.js';
import ProductCard from './components/ProductCard.js';
import ProductDetail from './pages/ProductDetail.js';
import Footer from './components/Footer.js';
import CartPage from './pages/CartPage';
import PhonePage from './components/PhonePage.js';
import LaptopPage from './components/LaptopPage.js';
import AdminPage from './pages/AdminPage';
import AdminDemo from './pages/AdminDemo';
import SearchResults from './pages/SearchResults';


function App() {
  return (
    <div>
      <ToastContainer />
      {/* <Header /> */}
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/user' element={<UserProfile />} />
          <Route path='/phone' element={<PhonePage />} />
          <Route path='/laptop' element={<LaptopPage />} />
          <Route path='/cart' element={<CartPage />} /> 
          <Route path='/admin/userlist' element={<UserListPage/>} />
          <Route path='/admin/productlist' element={<ProductListPage/>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/demo" element={<AdminDemo />} />
          <Route path="/search" element={<SearchResults />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
