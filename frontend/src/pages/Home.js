import React, { useState, useContext, useEffect } from 'react'
import SalesCarousel from '../components/SalesCarousel.js'
import RecommendationGrid from '../components/RecommendationGrid.js'
import Sale from '../components/Sale.js'
import AdvertisementCarousel from '../components/AdvertisementCarousel.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import Pagination from '../components/Pagination.js'
import { AppContext } from '../context/AppContext.js'
import { Button } from 'react-bootstrap'
import '../styles/AdminPage.css'
import '../styles/NavigationButtons.css'
import Navbar from '../components/Navbar.js'
import PhonePage from '../components/PhonePage.js'
import LaptopPage from '../components/LaptopPage.js'
import WatchPage from '../components/WatchPage.js'
import SmartwatchPage from '../components/SmartwatchPage.js'
import TabletPage from '../components/TabletPage.js'
import KeyboardPage from '../components/KeyboardPage.js'
import ScreenPage from '../components/ScreenPage.js'
import MousePage from '../components/MousePage.js'
import PrinterPage from '../components/PrinterPage.js'
const Home = () => {
  const { userData, productItems, backendUrl } = useContext(AppContext);
  const isAdmin = userData?.role === 'admin';
  const { categoryType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Create separate state for recommendations
  const [recommendationItems, setRecommendationItems] = useState([]);

  // Extract category from URL if present
  const getCategoryFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/category/')) {
      return path.split('/')[2];
    }
    // For legacy URL paths
    if (path === '/phone') return 'phone';
    if (path === '/laptop') return 'laptop';
    if (path === '/watch') return 'watch';
    if (path === '/smartwatch') return 'smartwatch';
    if (path === '/tablet') return 'tablet';
    if (path === '/keyboard') return 'keyboard';
    if (path === '/mouse') return 'mouse';
    if (path === '/screen') return 'screen';
    if (path === '/printer') return 'printer';
    return null;
  };

  const [activeCategory, setActiveCategory] = useState(categoryType || getCategoryFromPath() || null);

  // Update active category when URL parameter changes
  useEffect(() => {
    const category = categoryType || getCategoryFromPath();
    if (location.pathname === '/') {
      setActiveCategory(null);
    } else if (category) {
      setActiveCategory(category);
    }
  }, [categoryType, location.pathname]);

  // Handle category change
  const handleCategoryChange = (category) => {

    setActiveCategory(category);
  if (category === null) {
    navigate('/', {replace: true});
  } else {
    navigate(`/category/${category}`, { replace: true });
  }
  };

  // Render the appropriate category component based on the activeCategory
  const renderCategoryComponent = () => {
    switch (activeCategory) {
      case 'phone':
        return <PhonePage />;
      case 'laptop':
        return <LaptopPage />;
      case 'watch':
        return <WatchPage />;
      case 'smartwatch':
        return <SmartwatchPage />;
      case 'tablet':
        return <TabletPage />;
      case 'keyboard':
        return <KeyboardPage />;
      case 'mouse':
        return <MousePage />;
      case 'printer':
        return <PrinterPage />;
      case 'screen':
        return <ScreenPage />;
      default:
        return (
          <>
            <AdvertisementCarousel />
            <Sale />
            <RecommendationGrid products={recommendationItems} />
            <Pagination pageName="recommendationPage" setItems={setRecommendationItems} />
          </>
        );
    }
  };

  return (
    <div>
      <Header />
      <Navbar onCategoryChange={handleCategoryChange} activeCategory={activeCategory} />
      <div className="container-fluid py-4" >
        {renderCategoryComponent()}
      </div>
      <Footer />

      {isAdmin && (
        <Link to="/admin">
          <Button
            className="nav-button admin-button"
          >
            <i className="bi bi-gear"></i>
            Trang quản lý
          </Button>
        </Link>
      )}
    </div>
  )
}

export default Home