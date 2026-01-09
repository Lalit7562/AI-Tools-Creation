
import React from 'react';

interface SkeletonLoaderProps {
  type: 'gst' | 'ifsc' | 'instagram';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden animate-pulse border border-white/5">
      {/* Header Skeleton */}
      <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-white/10 rounded-lg"></div>
          <div className="h-4 w-32 bg-blue-500/20 rounded-lg"></div>
        </div>
        <div className="h-10 w-24 bg-white/5 rounded-full"></div>
      </div>
      
      {/* Body Skeleton */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-white/5 rounded"></div>
            <div className="h-6 w-full bg-white/10 rounded-lg"></div>
          </div>
        ))}
        <div className="md:col-span-2 space-y-2">
          <div className="h-3 w-32 bg-white/5 rounded"></div>
          <div className="h-12 w-full bg-white/10 rounded-xl"></div>
        </div>
      </div>

      {/* Footer/Sources Skeleton */}
      <div className="p-8 bg-black/20 border-t border-white/5 flex gap-3">
        <div className="h-8 w-32 bg-white/5 rounded-xl"></div>
        <div className="h-8 w-32 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
