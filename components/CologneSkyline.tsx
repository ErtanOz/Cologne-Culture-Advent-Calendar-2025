import React from 'react';

export const CologneSkyline: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="w-full h-auto opacity-30 text-red-900 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple stylized silhouette of Cologne Cathedral (Dom) and Rhine bridge */}
        <path d="M0,300 L0,250 L100,250 L150,200 L180,200 L200,100 L220,50 L240,100 L250,200 L270,200 L280,100 L300,50 L320,100 L340,200 L400,220 L450,220 L500,250 L1200,250 L1200,300 Z" />
        <rect x="210" y="20" width="10" height="40" className="opacity-50" />
        <rect x="290" y="20" width="10" height="40" className="opacity-50" />
      </svg>
    </div>
  );
};