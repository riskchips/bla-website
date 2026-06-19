const Skeleton = ({ height = 20, width = "100%", style = {} }) => (
  <div className="skel" style={{ height, width, ...style }} />
);

export const SkeletonCard = () => (
  <div className="card" style={{ minHeight: 180 }}>
    <Skeleton height={18} width="60%" />
    <div style={{ height: 10 }} />
    <Skeleton height={12} width="40%" />
    <div style={{ height: 18 }} />
    <Skeleton height={12} />
    <div style={{ height: 8 }} />
    <Skeleton height={12} width="80%" />
  </div>
);

export default Skeleton;
