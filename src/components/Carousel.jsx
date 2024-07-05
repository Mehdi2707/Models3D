import React, { useEffect, useRef, useState } from 'react';
import Slide from './Slide';
import './carousel.css';

const Carousel = ({ images, files }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const initializedContainers = useRef({});

  const goToSlide = (index) => {
    if (index >= files.length + images.length) {
      index = 0;
    } else if (index < 0) {
      index = files.length + images.length - 1;
    }
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  useEffect(() => {
    if (files[currentIndex] && window.StlViewer) {
      const file = files[currentIndex];
      const containerId = `stl_cont_${file.id}`;
      const container = document.getElementById(containerId);

      if (!container) return;

      // Vérifier si ce conteneur a déjà été initialisé pour éviter des initialisations multiples
      if (initializedContainers.current[containerId]) {
        return;
      }

      // Marquer ce conteneur comme initialisé
      initializedContainers.current[containerId] = true;

      // Nettoyer le conteneur avant d'ajouter un nouveau canvas (uniquement si non initialisé)
      if (!container.hasChildNodes()) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        // Initialiser le STL Viewer
        new window.StlViewer(container, {
          models: [{ id: file.id, filename: file.url }]
        });
      }
    }
  }, [currentIndex, files]);

  return (
    <div className="slideshow-container">
      {files.map((file, index) => (
        <Slide
          key={index}
          content={
            <div id={`stl_cont_${file.id}`} style={{height: '25rem'}}></div>
          }
          isActive={index === currentIndex}
        />
      ))}
      {images.map((image, index) => (
        <Slide
          key={files.length + index}
          content={<img src={image} style={{ width: '100%', verticalAlign: 'middle' }} alt="Slide" />}
          isActive={files.length + index === currentIndex}
        />
      ))}
      <a className="prev" onClick={prevSlide}>❮</a>
      <a className="next" onClick={nextSlide}>❯</a>
      <div style={{ textAlign: 'center' }}>
      {[...Array(files.length + images.length)].map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'activeElement' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
