import React from "react";

export default function CryptoCurrencyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      {/* Header with icon and text */}
      <div className="flex items-center mb-4 gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Graph placeholder */}
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}