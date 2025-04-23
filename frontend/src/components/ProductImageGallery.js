import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-gallery">
      <div className="main-image mb-3">
        <Image 
          src={selectedImage} 
          alt="Product" 
          fluid 
          className="rounded"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
      </div>
      <div className="thumbnail-list d-flex gap-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail-item ${selectedImage === image ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            <Image 
              src={image} 
              alt={`Thumbnail ${index + 1}`} 
              thumbnail
              style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery; 