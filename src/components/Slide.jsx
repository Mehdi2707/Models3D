import React from 'react';

const Slide = ({ content, isActive }) => {
    return (
      <div className={`mySlides fade ${isActive ? 'active' : ''}`} style={{ display: isActive ? 'block' : 'none' }}>
        {content}
      </div>
    );
  };

export default Slide;