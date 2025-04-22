import React from 'react'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import SalesCarousel from '../components/SalesCarousel.js'
import RecommendationGrid from '../components/RecommendationGrid.js'
import NavbarComponent from '../components/Navbar.js'
import AdvertisementCarousel from '../components/AdvertisementCarousel.js'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <Header />
        <NavbarComponent />
        <div className="container-fluid py-4">
            <SalesCarousel />
            <RecommendationGrid />
            <div className="text-center mt-4">
                <Link to="/demo-product" className="btn btn-primary">
                    View Demo Product Detail
                </Link>
            </div>
        </div>
        <AdvertisementCarousel />
        <Footer />
    </div>
  )
}

export default Home