"use client"

import type React from "react"
import { useState } from "react"
import SupportRequests from "@/src/components/CustomerSupport/SupportRequest"
import Chats from "@/src/components/CustomerSupport/Chats"

// tabs are transactions, wallet, p2p trading store in object array
const tabs = [
  { id: "supportRequests", title: "Support Requests" },
  { id: "chats", title: "Chats" }
]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <main className="w-full px-6 sm:px-10 py-6 font-[satoshi]">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full bg-white rounded-lg">
          <div className="flex justify-center items-center mb-2">
            <div className="flex w-fit">
                {tabs.map((tab) => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-black ${activeTab === tab.id
                        ? "border-b-2 border-primary font-semibold"
                        : "hover:text-gray-700 cursor-pointer"
                        }`}
                    >
                    {tab.title}
                    </button>
                ))}
            </div>
          </div>

          {activeTab === "supportRequests" && (
            <SupportRequests />
          )}

            {activeTab === "chats" && (
                <Chats />
            )}

        </div>
      </div>
    </main>
  )
}