"use client"

import type React from "react"
import { useState } from "react"
import Overview from "@/src/components/dashboard/Overview"
import Insights from "@/src/components/dashboard/Insights"
import Tabs from "@/src/components/ui/Tabs"

const tabs = ["Overview", "User Insights"]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <main className="w-full font-[satoshi] px-6 sm:px-10 py-6">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full bg-white rounded-lg">
          <div className="flex justify-center items-center mb-2">
            <Tabs
              tabs={tabs}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              size="normal"
            />
          </div>

          {activeTab.toLowerCase() === "overview" && (
            <Overview />
          )}

          {activeTab.toLowerCase() === "user insights" && (
            <Insights />
          )}
        </div>
      </div>
    </main>
  )
}