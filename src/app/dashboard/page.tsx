"use client"

import type React from "react"
import { useState } from "react"
import Overview from "@/src/components/dashboard/Overview"
import Insights from "@/src/components/dashboard/Insights"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="w-full px-4 py-6">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full mx-auto max-w-6xl bg-white rounded-lg p-6">
          <div className="flex justify-center items-center mb-2">
          <div className="flex w-fit">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-medium text-black ${activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-xl font-bold"
                  : "hover:text-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "insights"
                  ? "border-b-2 border-blue-600 font-bold text-xl"
                  : "hover:text-gray-700"
                }`}
            >
              User Insights
            </button>
          </div>
          </div>

          {activeTab === "overview" && (
            <Overview />
          )}

          {activeTab === "insights" && (
            <Insights />
          )}
        </div>
      </div>
    </main>
  )
}