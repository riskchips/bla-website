const Ornament = ({ label }) => (
  <div className="ornament" aria-hidden="true">
    <span className="line" />
    <span className="kalka">{label || "❉"}</span>
    <span className="line" />
  </div>
);

export default Ornament;
