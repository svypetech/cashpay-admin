"use client"

import AllUsers from "@/src/components/users/AllUsers";
import Image from "next/image";
import { useState } from "react";

export default function UsersPage() {
  const [activePage, setActivePage] = useState("users")
  const [activeTab, setActiveTab] = useState("all")

  return (
      <main className="container mx-auto px-4 py-6">

        <div className="w-full flex justify-center items-center mb-4">
            <div className="flex gap-2 bg-secondary2 px-4 py-2 rounded-xl" >
                <button className={`cursor-pointer px-6 py-2 rounded-xl ${activePage === "users" ? "bg-primary text-white" : ""}`} 
                    onClick={() => setActivePage("users")}>
                        Users
                </button>
                <button className={`cursor-pointer px-6 py-2 rounded-xl ${activePage === "admins" ? "bg-primary text-white" : ""}`} 
                    onClick={() => setActivePage("admins")}>
                    Admins
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-10 w-full flex items-center mb-4">
            <div className="flex w-fit">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-black ${activeTab === "all"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("verified")}
                className={`px-4 py-2 ${activeTab === "verified"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Verified
              </button>
              <button
                onClick={() => setActiveTab("pending verifications")}
                className={`px-4 py-2 ${activeTab === "pending verifications"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Pending Verifications
              </button>
            </div>
          </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 md:px-10">
          <div className="relative w-full md:w-auto md:col-span-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-primary focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Image src="/icons/search.svg" alt="Arrow right" width={24} height={24} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full col-span-1 font-[satoshi]">
            <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <span>Sort by</span>
              <Image src="/icons/dropdownIcon.svg" alt="Arrow right" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        {activeTab === "all" && (
          <AllUsers activeTab="all" />
        )}

        {activeTab === "verified" && (
          <AllUsers activeTab="verified" />
        )}

        {activeTab === "pending verifications" && (
          <AllUsers activeTab="pending" />
        )}

      </main>
  )
}