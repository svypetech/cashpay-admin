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
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "insights"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              User Insights
            </button>
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