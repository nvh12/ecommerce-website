import React from 'react'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import ProductGrid from '../components/ProductGrid.js'
import NavbarComponent from '../components/Navbar.js'
const Home = () => {
  return (
    <div>
        <Header />
        <NavbarComponent />
        <ProductGrid />
        <Footer />
    </div>
  )
}

export default Home