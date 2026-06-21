import { useEffect, useState } from "react";

const Lightbox = ({ src, images = [], initialIndex = 0, onClose }) => {
  const isArray = images && images.length > 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (isArray && images) {
        if (e.key === "ArrowRight") {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else if (e.key === "ArrowLeft") {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, isArray, images]);

  if (!src && !isArray) return null;

  const currentSrc = isArray ? images[currentIndex] : src;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose} style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <button 
        onClick={onClose} 
        className="cursor-target" 
        aria-label="Close"
        style={{
            position: 'absolute', top: '15px', right: '15px',
            background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white',
            fontSize: '1.8rem', cursor: 'pointer', zIndex: 10,
            width: '44px', height: '44px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        }}
      >
        ✕
      </button>

      {isArray && images.length > 1 && (
        <button
          className="cursor-target"
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
          style={{
              position: 'absolute', left: 'max(10px, 3vw)', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              fontSize: '2rem', padding: '0', cursor: 'pointer', borderRadius: '50%',
              width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', zIndex: 10
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}

      <img 
        src={currentSrc} 
        alt="" 
        onClick={(e) => e.stopPropagation()} 
        style={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain'
        }}
      />

      {isArray && images.length > 1 && (
        <button
          className="cursor-target"
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
          style={{
              position: 'absolute', right: 'max(10px, 3vw)', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              fontSize: '2rem', padding: '0', cursor: 'pointer', borderRadius: '50%',
              width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(4px)', zIndex: 10
          }}
          aria-label="Next image"
        >
          ›
        </button>
      )}
      
      {isArray && images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '20px', color: 'white', fontSize: '0.9rem' }}>
              {currentIndex + 1} / {images.length}
          </div>
      )}
    </div>
  );
};

export default Lightbox;
