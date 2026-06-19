const AlpanaDivider = () => (
  <div className="divider" aria-hidden="true">
    <svg viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left connecting line */}
      <line x1="0" y1="15" x2="60" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* Left small dot cluster */}
      <circle cx="65" cy="15" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="72" cy="15" r="1" fill="currentColor" opacity="0.4" />

      {/* Left decorative circle with inner dot */}
      <circle cx="82" cy="15" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="82" cy="15" r="1.8" fill="currentColor" opacity="0.5" />

      {/* Left arc connector to center */}
      <path
        d="M88 15 Q 100 6, 112 15"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M88 15 Q 100 24, 112 15"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />

      {/* Central lotus / floral motif */}
      <path
        className="alpana-stroke"
        d="M150 5
           C 144 5, 138 10, 138 15
           C 138 20, 144 25, 150 25
           C 156 25, 162 20, 162 15
           C 162 10, 156 5, 150 5
           M 150 2
           C 146 8, 140 12, 135 15
           C 140 18, 146 22, 150 28
           M 150 2
           C 154 8, 160 12, 165 15
           C 160 18, 154 22, 150 28"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Central small inner dots forming a ring */}
      <circle cx="150" cy="10" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="145" cy="15" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="155" cy="15" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="150" cy="20" r="1" fill="currentColor" opacity="0.7" />
      {/* True center dot */}
      <circle cx="150" cy="15" r="2" fill="currentColor" opacity="0.5" />

      {/* Right arc connector from center */}
      <path
        d="M188 15 Q 200 6, 212 15"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M188 15 Q 200 24, 212 15"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />

      {/* Right decorative circle with inner dot */}
      <circle cx="218" cy="15" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="218" cy="15" r="1.8" fill="currentColor" opacity="0.5" />

      {/* Right small dot cluster */}
      <circle cx="228" cy="15" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="235" cy="15" r="1.5" fill="currentColor" opacity="0.6" />

      {/* Right connecting line */}
      <line x1="240" y1="15" x2="300" y2="15" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  </div>
);

export default AlpanaDivider;
