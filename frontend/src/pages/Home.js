import React, { useState, useContext } from 'react'
import SalesCarousel from '../components/SalesCarousel.js'
import RecommendationGrid from '../components/RecommendationGrid.js'
import Sale from '../components/Sale.js'
import AdvertisementCarousel from '../components/AdvertisementCarousel.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import { Link } from 'react-router-dom'
import Pagination from '../components/Pagination.js'
import { AppContext } from '../context/AppContext.js'
import { Button } from 'react-bootstrap'
import '../styles/AdminPage.css'

const Home = () => {
  const { userData } = useContext(AppContext);
  const isAdmin = userData?.role === 'admin';

  return (
    <div>
      <Header />
        <div className="container-fluid py-4">
            {/* <SalesCarousel /> */}
            <Sale />
            <RecommendationGrid />
        </div>
        <AdvertisementCarousel />
        <Pagination pageName="productsPage"/>
      <Footer />
      
      {isAdmin && (
        <Link to="/admin">
          <Button 
            variant="danger" 
            className="fixed-nav-button"
          >
            Admin Dashboard
          </Button>
        </Link>
      )}
    </div>
  )
}

export default Home