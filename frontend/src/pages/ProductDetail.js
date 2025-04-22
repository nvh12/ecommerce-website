import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSpecifications from '../components/ProductSpecifications';

const ProductDetail = () => {
  const product = {
    name: "Xiaomi Redmi Note 14 8GB-128GB",
    price: 5990000,
    originalPrice: 6490000,
    images: [
      "/images/redmi-note-14-black.jpg",
      "/images/redmi-note-14-blue.jpg",
      "/images/redmi-note-14-white.jpg"
    ],
    colors: [
      { name: "Đen", code: "#000000" },
      { name: "Xanh dương", code: "#0077BE" },
      { name: "Trắng", code: "#FFFFFF" }
    ],
    specifications: {
      screen: "AMOLED 6.67 inch, Full HD+",
      os: "Android 13",
      camera: "Camera sau: 108MP + 8MP + 2MP\nCamera trước: 16MP",
      chip: "MediaTek Dimensity 6080",
      ram: "8 GB",
      storage: "128 GB",
      battery: "5000 mAh, Sạc nhanh 33W"
    },
    highlights: [
      "Màn hình AMOLED 6.67 inch sắc nét",
      "Chip MediaTek Dimensity 6080 mạnh mẽ",
      "RAM 8 GB cho đa nhiệm mượt mà",
      "Camera chính 108MP chụp ảnh sắc nét",
      "Pin 5000 mAh, sạc nhanh 33W"
    ]
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <ProductImageGallery images={product.images} />
        </Col>
        <Col md={6}>
          <ProductInfo 
            product={product}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ProductSpecifications specifications={product.specifications} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail; 