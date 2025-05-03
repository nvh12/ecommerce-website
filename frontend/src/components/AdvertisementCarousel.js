import React from 'react';
import { Carousel } from 'react-bootstrap';

const AdvertisementCarousel = () => {
    // Sample advertisement data - replace with your actual data
    const advertisements = [
        {
            id: 1,
            image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/3f/4f/3f4fdd417a1ccde2313e75d0724c7fc2.png',
            title: 'Iphone 16 series',
            link: '/product/67f63cab2c5de98b7b35c481'
        },
        {
            id: 2,
            image: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/28/5a/285acf24bea6aadbcde301014fb1ce98.png',
            title: 'Samsung S22',
            link: '/product/680515042f5b77f60517ad47'
        },
        {
            id: 3,
            image: 'https://example.com/ad3.jpg',
            title: 'Advertisement 3',
            link: '/product/3'
        },
        {
            id: 4,
            image: 'https://example.com/ad4.jpg',
            title: 'Advertisement 4',
            link: '/product/4'
        }
    ];

    // Group advertisements into pairs for showing 2 per slide
    const groupedAds = [];
    for (let i = 0; i < advertisements.length; i += 2) {
        groupedAds.push(advertisements.slice(i, i + 2));
    }

    return (
        <Carousel 
            className="advertisement-carousel mb-4"
            interval={3000}
            indicators={false}
        >
            {groupedAds.map((adPair, index) => (
                <Carousel.Item key={index}>
                    <div className="d-flex justify-content-center gap-3">
                        {adPair.map(ad => (
                            <a 
                                key={ad.id}
                                href={ad.link}
                                className="text-decoration-none"
                            >
                                <img
                                    src={ad.image}
                                    alt={ad.title}
                                    style={{
                                        width: '600px',
                                        height: '180px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </a>
                        ))}
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default AdvertisementCarousel;
