import React from 'react';

const Gallery = ({ images }) => {
  return (
    <div>
      {images && images.length > 0 ? (
        <div>
       {images.map((pic, index) => (
            <img 
             key={index} 
              src={pic} 
              alt={`Screenshot ${index + 1}`} 
              className="gallery-img"
               />
          ))}
         </div>
      ) : (
        <div>
             <p>You haven't made a screenshot yet!</p>
        </div>
      )}
    </div>
        );
    };

export default Gallery;
