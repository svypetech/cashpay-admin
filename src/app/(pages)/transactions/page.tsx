"use client"

import type React from "react"
import { useState } from "react"
import Transactions from "@/src/components/transaction/Transactions"
import Wallet from "@/src/components/transaction/Wallet"
import P2PTrading from "@/src/components/p2pTrading/P2PTrading"
import P2PListings from "@/src/components/transaction/P2PListings"
import Tabs from "@/src/components/ui/Tabs"

// tabs are transactions, wallet, p2p trading store in object array
const tabs = ["Transactions", "Wallet", "P2P Trading", "P2P Listings"]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <main className="w-full px-6 sm:px-10 py-6 font-[satoshi]">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full mx-auto bg-white rounded-lg">
          <div className="flex justify-center items-center mb-2">
            <Tabs
              tabs={tabs}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              size="normal"
            />
          </div>

          {activeTab.toLowerCase() === "transactions" && (
            <Transactions />
          )}

          {activeTab.toLowerCase() === "wallet" && (
            <Wallet />
          )}

          {activeTab.toLowerCase() === "p2p trading" && (
            <P2PTrading />
          )}

          {activeTab.toLowerCase() === "p2p listings" && (
            <P2PListings />
          )}
        </div>
      </div>
    </main>
  )
}