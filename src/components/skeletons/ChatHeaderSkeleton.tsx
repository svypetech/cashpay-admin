import React from "react";

export default function ChatHeaderSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Header content */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* User avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            {/* Status indicator skeleton */}
            <div className="absolute top-0 left-0 w-3 h-3 rounded-full border-2 border-white bg-gray-300"></div>
          </div>
          <div>
            {/* Username skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            {/* User details skeleton */}
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        {/* Close button placeholder */}
        <div className="w-8 h-8 rounded bg-gray-200"></div>
      </div>

      {/* Styled horizontal line with spacing */}
      <div className="px-4 pb-1">
        <div className="h-[1px] bg-gray-200 w-full"></div>
      </div>
    </div>
  );
}