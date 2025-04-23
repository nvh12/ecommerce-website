import React, { useContext } from 'react';
import { Carousel } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

const AdvertisementCarousel = () => {
  const {productItems} = useContext(AppContext)
  const advertisements = [
    {
      id: 1,
      image: "/images/ads/samsung-a-series.jpg",
      title: "Galaxy A Series 5G",
      link: "/samsung-a-series"
    },
    {
      id: 2,
      image: "/images/ads/iphone-16.jpg",
      title: "iPhone 16 Series",
      link: "/iphone-16"
    },
    // Add more ads as needed
  ];

  return (
    <div className="advertisement-carousel mb-4">
      <Carousel
        controls={true}
        indicators={true}
        interval={5000}
        nextIcon={<FaChevronRight className="carousel-control-icon" />}
        prevIcon={<FaChevronLeft className="carousel-control-icon" />}
      >
        {productItems.map((ad) => (
          <Carousel.Item key={ad._id}>
            <a href={ad.link} className="d-block w-100">
              <img
                className="d-block w-100"
                src={ad.images[0]}
                alt={ad.title}
                style={{ 
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </a>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default AdvertisementCarousel; 