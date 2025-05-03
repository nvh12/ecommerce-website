import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PhonePage from '../components/PhonePage';
import LaptopPage from '../components/LaptopPage';
import WatchPage from '../components/WatchPage';
import SmartwatchPage from '../components/SmartwatchPage';
import TabletPage from '../components/TabletPage';
import { Container } from 'react-bootstrap';

const CategoryPage = () => {
  const { categoryType } = useParams();
  const [activeCategory, setActiveCategory] = useState(categoryType || 'phone');

  // Update active category when URL parameter changes
  useEffect(() => {
    if (categoryType) {
      setActiveCategory(categoryType);
    }
  }, [categoryType]);

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
      default:
        return <div>Không có danh mục nào</div>;
    }
  };

  return (
    <div>
      <Header />
      <Navbar onCategoryChange={setActiveCategory} activeCategory={activeCategory} />
      <Container fluid className="py-4">
        {renderCategoryComponent()}
      </Container>
      <Footer />
    </div>
  );
};

export default CategoryPage; 