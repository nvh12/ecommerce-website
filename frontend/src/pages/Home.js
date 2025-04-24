import React from 'react'
import SalesCarousel from '../components/SalesCarousel.js'
import RecommendationGrid from '../components/RecommendationGrid.js'
import AdvertisementCarousel from '../components/AdvertisementCarousel.js'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className="container-fluid py-4">
            <SalesCarousel />
            <RecommendationGrid />
        </div>
        <AdvertisementCarousel />
    </div>
  )
}

export default Home