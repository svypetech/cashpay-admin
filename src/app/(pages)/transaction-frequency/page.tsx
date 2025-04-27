"use client"

import TransactionFrequencyPage from "@/src/components/transaction/TransactionFrequency";
import ActiveUsers from "@/src/components/users/ActiveUsers";
import UserEngagement from "@/src/components/users/UserEngagement";
import Image from "next/image";
import { useState } from "react";

export default function Page() {

  return (
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <h1 className="text-3xl font-[satoshi] font-bold md:px-10 my-10" >Transaction Frequency</h1>

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
            <button className="w-[50%] flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <span>Filter</span>
              <Image src="/icons/calendar.svg" alt="Arrow right" width={24} height={24} />
            </button>

            <button className="w-[50%] flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0">
              <span>Download</span>
              <Image src="/icons/download.svg" alt="Arrow right" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <TransactionFrequencyPage />

      </main>
  )
}