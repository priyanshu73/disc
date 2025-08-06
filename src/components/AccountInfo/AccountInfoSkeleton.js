import React from 'react';
import './AccountInfo.css';

const AccountInfoSkeleton = () => (
  <div className="sectionContainer">
    <div className="sectionHeader">
      <div style={{ height: 28, width: 180, borderRadius: 8, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear', marginBottom: 8 }} />
      <div style={{ height: 16, width: 220, borderRadius: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
    </div>
    <div className="contentBody">
      {/* Avatar and name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
        <div>
          <div style={{ height: 18, width: 120, borderRadius: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear', marginBottom: 8 }} />
          <div style={{ height: 14, width: 90, borderRadius: 6, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
        </div>
      </div>
      <hr className="separator" />
      {/* Info grid */}
      <div className="infoGrid">
        {[1,2,3,4,5].map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: 14, width: 80, borderRadius: 4, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear', marginBottom: 4 }} />
            <div style={{ height: 24, width: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.2s infinite linear' }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  </div>
);

export default AccountInfoSkeleton; 