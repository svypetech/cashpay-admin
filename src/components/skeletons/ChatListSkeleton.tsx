import React from "react";

export default function ChatListSkeleton() {
  // Create an array to render multiple chat item skeletons
  const skeletonItems = Array(8).fill(null);

  return (
    <div className="flex flex-col max-h-[718px] animate-pulse">
      {/* Header skeleton */}
      <div className="p-6 border-b border-primary7/30">
        <div className="h-7 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Filter tabs skeleton */}
      <div className="flex border-b border-primary7/30 p-2">
        <div className="flex-1 h-6 bg-gray-200 rounded mx-1"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded mx-1"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded mx-1"></div>
      </div>

      {/* Search skeleton */}
      <div className="p-4 border-b border-primary7/30">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>

      {/* Chat list items skeleton */}
      <div className="flex-1 overflow-y-scroll">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 ${
              index !== 0 ? "border-t border-primary7/30" : ""
            }`}
          >
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                {/* Username skeleton */}
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                {/* Timestamp skeleton */}
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              {/* Message preview skeleton */}
              <div className="h-3 bg-gray-200 rounded w-full max-w-[180px]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}