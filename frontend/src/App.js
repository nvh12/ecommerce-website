import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home.js'
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import UserProfile from './pages/UserProfile.js';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './pages/ProductDetail.js';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/user' element={<UserProfile />} />
          <Route path='/cart' element={<CartPage />} /> 
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/search" element={<SearchResults />} />
          
          {/* New category route pattern */}
          <Route path="/category/:categoryType" element={<CategoryPage />} />
          
          {/* Legacy routes for backward compatibility - redirect to category page */}
          <Route path='/phone' element={<CategoryPage />} />
          <Route path='/laptop' element={<CategoryPage />} />
          <Route path='/tablet' element={<CategoryPage />} />
          <Route path='/watch' element={<CategoryPage />} />
          <Route path='/smartwatch' element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
