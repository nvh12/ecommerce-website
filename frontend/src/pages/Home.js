import React from 'react'
import SalesCarousel from '../components/SalesCarousel.js'
import RecommendationGrid from '../components/RecommendationGrid.js'
import AdvertisementCarousel from '../components/AdvertisementCarousel.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <Header />
        <div className="container-fluid py-4">
            <SalesCarousel />
            <RecommendationGrid />
        </div>
        <AdvertisementCarousel />
      <Footer />
    </div>
  )
}

export default Home