import React, { useEffect, useRef, useState } from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => {
  const [rowCount, setRowCount] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const count = Math.floor(containerRef.current.offsetHeight / 16 + 8);
      setRowCount(count);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full overflow-hidden ${className}`}
    >
      {Array.from({ length: rowCount }).map((_, index) => (
        <div
          key={index}
          className={` bg-gray-200 h-[16px] mb-2 rounded animate-opacity`}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
