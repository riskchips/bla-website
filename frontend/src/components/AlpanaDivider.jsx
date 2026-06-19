const AlpanaDivider = () => (
  <div className="divider" aria-hidden="true">
    <svg viewBox="0 0 220 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="12" x2="78" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="86" cy="12" r="2" fill="currentColor" />
      <path
        d="M96 12 C 102 4, 112 4, 110 12 C 108 18, 102 18, 110 22 C 118 18, 112 18, 110 12 C 108 4, 118 4, 124 12"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="134" cy="12" r="2" fill="currentColor" />
      <line x1="142" y1="12" x2="220" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  </div>
);

export default AlpanaDivider;
