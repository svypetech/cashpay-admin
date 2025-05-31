"use client";

import React from "react";

export default function UserInsightsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-5 gap-4 h-full">
        <div className="flex flex-col gap-2 col-span-3 h-full">
          {/* Avg Login/user skeleton */}
          <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <div className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Avg Session skeleton */}
          <div className="p-4 border border-gray-200 rounded-lg h-[50%] flex flex-col justify-center">
            <div className="flex items-start gap-3">
              <div className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users skeleton */}
        <div className="p-4 border border-gray-200 rounded-lg col-span-2 overflow-hidden">
          <div className="flex-col h-full">
            <div className="flex gap-3 mb-4">
              <div className="sm:w-[55px] sm:h-[55px] w-[40px] h-[40px] bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-col justify-center">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-center h-full">
              <div className="h-12 w-24 bg-gray-200 rounded animate-pulse relative top-[-20px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}