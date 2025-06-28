"use client";

import { X } from "lucide-react";

interface Props {
  showSidebar: boolean;
  onClose: () => void;
  shouldSlideIn: boolean;
}

export default function UserSidebarSkeleton({
  showSidebar,
  onClose,
  shouldSlideIn,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          shouldSlideIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          shouldSlideIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 mt-5">
            <h2 className="text-2xl font-semibold">User Profile</h2>
            <button
              onClick={onClose}
              className="rounded-full cursor-pointer p-1 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
            {/* Profile Image Skeleton */}
            <div className="mb-4 h-32 w-32 bg-gray-200 rounded-full animate-pulse"></div>

            {/* User Info Skeleton */}
            <div className="mb-1 h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="mb-6 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>

            {/* User Details Skeleton */}
            <div className="flex flex-col justify-center mb-6 w-full">
              <div className="mb-2 flex w-full items-center">
                <div className="px-8 flex w-full gap-5 justify-between">
                  <div className="flex gap-2 w-24">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="mb-2 flex w-full items-center">
                <div className="px-8 flex w-full gap-5 justify-between">
                  <div className="flex gap-2 w-24">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* KYC Verification Section Skeleton */}
            <div className="flex flex-col justify-center w-full px-8">
              <div className="mb-4 flex w-full items-center justify-between gap-10">
                <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}