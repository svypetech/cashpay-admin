"use client"

import Admins from "@/src/components/admins/Admins";
import MerchantsComponent from "@/src/components/merchants/MerchantsComponent";
import AllUsers from "@/src/components/users/AllUsers";
import { useState } from "react";

const tabs = [
  { id: "users", title: "Users" },
  { id: "admins", title: "Admins" },
  { id: "merchants", title: "Merchants" }
]

export default function UsersPage() {
  const [activePage, setActivePage] = useState("users")

  return (
    <main className="px-6 sm:px-10 py-6">

      <div className="w-full flex justify-center items-center mb-4 font-satoshi">
        <div className="flex gap-2 bg-secondary2 px-4 py-2 rounded-xl" >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`cursor-pointer px-6 py-2 rounded-xl ${activePage === tab.id
                ? "bg-primary text-white"
                : ""
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {activePage === "users" && (
        <AllUsers />
      )}

      {/* Admins Table */}
      {activePage === "admins" && (
        <Admins />
      )}

      {/* Merchants Table */}
      {activePage === "merchants" && (
        <MerchantsComponent />
      )}

    </main>
  )
}