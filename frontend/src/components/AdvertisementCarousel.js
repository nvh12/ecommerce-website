import React from 'react';
import { Carousel } from 'react-bootstrap';

const AdvertisementCarousel = () => {
    // Sample advertisement data - replace with your actual data
    const advertisements = [
        {
            id: 1,
            image: 'https://th.bing.com/th/id/OIP.ynYm2G8wOXDoji82XyXzvgHaC0?w=2048&h=780&rs=1&pid=ImgDetMain',
            title: 'Iphone 11',
            link: '/product/6823580f538e2cf4f4555c77'
        },
        {
            id: 2,
            image: 'https://static.digit.in/default/all-new-acer-nitro-v-1280-3f9ed033db.jpeg',
            title: 'Laptop Acer Nitro 5',
            link: '/product/68294ffc945d84da573fe8ce'
        },
        {
            id: 3,
            image: 'https://i.ytimg.com/vi/yNX3E4qxWtc/maxresdefault.jpg',
            title: 'Bàn phím cơ',
            link: '/product/68236a72631e6e1bdec0c57b'
        },
        {
            id: 4,
            image: 'https://bizweb.dktcdn.net/100/329/122/files/banner-509df6e6-3bb1-4f27-ad35-fcfa1a8f6da7.png?v=1624422192810',
            title: 'Chuột Gaming không dây Logitech',
            link: '/product/682365ea631e6e1bdec0c4f0'
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
                                        objectFit: 'contain',
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
