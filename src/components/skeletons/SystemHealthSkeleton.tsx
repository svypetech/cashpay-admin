import React from "react";

export default function SystemHealthSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 w-full max-w-sm animate-pulse">
      {/* Title skeleton */}
      <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
      
      {/* Gauge chart skeleton */}
      <div className="relative" style={{ height: "100px" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-8 border-gray-200 border-t-gray-300 rounded-full"></div>
        </div>
        {/* Center value skeleton */}
        <div className="flex items-center justify-center absolute inset-0 top-12">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Button skeleton */}
      <div className="w-full flex justify-center mt-4">
        <div className="mt-4 w-48 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}