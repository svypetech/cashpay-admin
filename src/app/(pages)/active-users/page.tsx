"use client"

import ActiveUsers from "@/src/components/users/ActiveUsers";
import UserEngagement from "@/src/components/users/UserEngagement";
import Image from "next/image";
import { useState } from "react";

export default function ActiveUsersPage() {
  const [activeTab, setActiveTab] = useState("active users")

  return (
      <main className="px-6 sm:px-10 py-6">
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

        {/* Users Table */}
        {activeTab === "active users" ? (
          <ActiveUsers />
        ) : (
          <UserEngagement />
        )}

      </main>
  )
}