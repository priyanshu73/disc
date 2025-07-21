import React from 'react';

const SidebarSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[1, 2].map((_, i) => (
      <div
        key={i}
        style={{
          height: 38,
          borderRadius: 8,
          background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
          backgroundSize: '200% 100%',
          animation: 'skeleton-shimmer 1.2s infinite linear',
          width: '100%',
        }}
      />
    ))}
    <style>{`
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export default SidebarSkeleton; 