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
import NavbarComponent from './components/Navbar.js';
import Header from './components/Header.js';
import ProductCard from './components/ProductCard.js';
import ProductDetail from './pages/ProductDetail.js';
import Footer from './components/Footer.js';

const product = {
  name: "Lenovo Ideapad Slim 3 15IAH8 i5 12450H",
  image: "/path/to/laptop-image.jpg",
  ram: "16 GB",
  ssd: "512 GB",
  price: 14690000,
  originalPrice: 15990000,
  installmentAmount: 2190000,
  rating: 4.9,
  soldCount: 8000
};
function App() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/user' element={<UserProfile />} />
          <Route path='/admin/userlist' element={<UserListPage/>} />
          <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
      {/* <Header />
      <NavbarComponent />
      <ProductCard product={product} /> */}
    </div>
  );
}

export default App;
