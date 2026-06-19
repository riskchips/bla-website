import { useEffect } from "react";

const Lightbox = ({ src, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!src) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button onClick={onClose} className="cursor-target" aria-label="Close">Close ✕</button>
      <img src={src} alt="" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

export default Lightbox;
