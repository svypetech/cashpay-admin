"use client"

import ActiveUsers from "@/src/components/users/ActiveUsers";
import UserEngagement from "@/src/components/users/UserEngagement";
import { Search, Calendar, Download } from "lucide-react"
import Image from "next/image";
import { useState } from "react";

export default function ActiveUsersPage() {
  const [activeTab, setActiveTab] = useState("active users")

  return (
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="w-dull flex justify-center items-center mb-4">
            <div className="flex w-fit">
              <button
                onClick={() => setActiveTab("active users")}
                className={`px-4 py-2 text-black ${activeTab === "active users"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Active Users
              </button>
              <button
                onClick={() => setActiveTab("user engagement")}
                className={`px-4 py-2 ${activeTab === "user engagement"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                User Engagement
              </button>
            </div>
          </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 md:px-10">
          <div className="relative w-full md:w-auto md:col-span-2">
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

          <div className="flex items-center gap-4 w-full md:col-span-2 font-[satoshi]">
            <button className="w-[50%] cursor-pointer flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <span>Filter</span>
              <Image src="/icons/calendar.svg" alt="Arrow right" width={24} height={24} />
            </button>

            <button className="w-[50%] cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0">
              <span>Download</span>
              <Image src="/icons/download.svg" alt="Arrow right" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        {activeTab === "active users" ? (
          <ActiveUsers />
        ) : (
          <UserEngagement />
        )}

      </main>
  )
}