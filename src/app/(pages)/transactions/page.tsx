"use client"

import type React from "react"
import { useState } from "react"
import Transactions from "@/src/components/transaction/Transactions"
import Wallet from "@/src/components/transaction/Wallet"
import P2PTrading from "@/src/components/p2pTrading/P2PTrading"
import P2PListings from "@/src/components/transaction/P2PListings"

// tabs are transactions, wallet, p2p trading store in object array
const tabs = [
  { id: "transactions", title: "Transactions" },
  { id: "wallet", title: "Wallet" },
  { id: "p2p trading", title: "P2P Trading" },
  { id: "p2p listings", title: "P2P Listings" },  
]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <main className="w-full px-6 sm:px-10 py-6 font-[satoshi]">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full mx-auto bg-white rounded-lg">
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

          {activeTab === "p2p trading" && (
            <P2PTrading />
          )}

          {activeTab === "p2p listings" && (
            <P2PListings />
          )}
        </div>
      </div>
    </main>
  )
}