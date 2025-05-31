"use client";

import React from "react";

interface DisputeSkeletonCardProps {
  title?: string;
}

export default function DisputeSkeletonCard({
  title = "Loading Details...",
}: DisputeSkeletonCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 px-5">{title}</h2>

      <div className="flex px-5">
        {/* Left side - Avatar and name skeleton */}
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full overflow-hidden mb-2 bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Right side - User info skeleton */}
        <div className="flex-1 ml-6 flex flex-col justify-start px-5">
          {/* Contact Info skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-y-4 items-center mb-5">
            <div className="flex items-center lg:col-span-2">
              <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse lg:col-span-4"></div>

            <div className="flex items-center lg:col-span-2">
              <div className="w-4 h-4 mr-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse lg:col-span-4"></div>
          </div>

          {/* Trade Stats skeleton */}
          <div className="flex space-x-2 mb-2">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1 h-4">{" | "}</div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Action Button skeleton */}
      <div className="mt-4 px-5">
        <div className="w-40 h-9 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
}