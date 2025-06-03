import React from "react";

export default function TotalUsersCardSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
        <div className="mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        <div className="relative pr-5">
          {/* Grid lines skeleton */}
          <div className="absolute top-0 bottom-0 left-0 right-0 pl-24 pointer-events-none">
            <div className="relative h-full">
              {[0, 23, 45, 69, 92].map((position) => (
                <div
                  key={position}
                  className="absolute h-full border-l border-gray-200"
                  style={{ left: `${position}%, width: 0` }}
                />
              ))}
            </div>
          </div>

          {/* Skeleton bars */}
          <div className="relative space-y-6 mb-6">
            {/* New Users Bar Skeleton */}
            <div className="flex items-center">
              <div className="w-24 text-right pr-4">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 relative">
                <div className="h-3 bg-gray-200 rounded-full w-3/5"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 ml-2" style={{ left: "60%" }}>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Active Users Bar Skeleton */}
            <div className="flex items-center">
              <div className="w-24 text-right pr-4">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 relative">
                <div className="h-3 bg-gray-200 rounded-full w-4/5"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 ml-2" style={{ left: "80%" }}>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Inactive Users Bar Skeleton */}
            <div className="flex items-center">
              <div className="w-24 text-right pr-4">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 relative">
                <div className="h-3 bg-gray-200 rounded-full w-2/5"></div>
                <div className="absolute top-1/2 transform -translate-y-1/2 ml-2" style={{ left: "40%" }}>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* X-axis labels skeleton */}
          <div className="flex justify-between text-sm pl-24">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-4 w-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}