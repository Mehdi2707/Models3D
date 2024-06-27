import React, { useEffect, useRef, useState } from 'react';
import Slide from './Slide';
import './carousel.css';
import { Loader } from './Loader';

const Carousel = ({ images, files, loadingFiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    if (index >= images.length + files.length) {
      index = 0;
    } else if (index < 0) {
      index = images.length + files.length - 1;
    }
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  return (
    <div className="slideshow-container">
      {images.map((image, index) => (
        <Slide
          key={index}
          content={<img src={image} style={{ width: '100%', verticalAlign: 'middle' }} alt="Slide" />}
          isActive={index === currentIndex}
        />
      ))}
      {files.map((file, index) => (
        <Slide
          key={images.length + index} // Ensure unique key for each file
          content={<div id={`stl_cont_${file.id}`} style={{ textAlign: 'center' }}> {loadingFiles ? <Loader /> : null}</div>}
          isActive={images.length + index === currentIndex}
        />
      ))}
      <a className="prev" onClick={prevSlide}>❮</a>
      <a className="next" onClick={nextSlide}>❯</a>
      <div style={{ textAlign: 'center' }}>
        {[...Array(images.length + files.length)].map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
