"use client"

import type React from "react"
import { useState } from "react"
import Overview from "@/src/components/dashboard/Overview"
import Insights from "@/src/components/dashboard/Insights"
import Transactions from "@/src/components/transaction/Transactions"
import Wallet from "@/src/components/transaction/Wallet"

// tabs are transactions, wallet, p2p trading store in object array
const tabs = [
  { id: "transactions", title: "Transactions" },
  { id: "wallet", title: "Wallet" },
  { id: "p2p trading", title: "P2P Trading" },
]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <main className="w-full md:px-4 py-6 font-[satoshi]">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full mx-auto max-w-6xl bg-white rounded-lg p-6">
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

          {activeTab === "transactions" && (
            <Transactions />
          )}

          {activeTab === "wallet" && (
            <Wallet />
          )}
        </div>
      </div>
    </main>
  )
}