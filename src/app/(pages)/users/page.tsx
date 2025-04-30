"use client"

import Admins from "@/src/components/admins/Admins";
import AllUsers from "@/src/components/users/AllUsers";
import { useState } from "react";

export default function UsersPage() {
  const [activePage, setActivePage] = useState("users")

  return (
    <main className="container mx-auto px-4 py-6">

      <div className="w-full flex justify-center items-center mb-4 font-satoshi">
        <div className="flex gap-2 bg-secondary2 px-4 py-2 rounded-xl" >
          <button className={`cursor-pointer px-6 py-2 rounded-xl ${activePage === "users" ? "bg-primary text-white" : ""}`}
            onClick={() => setActivePage("users")}>
            Users
          </button>
          <button className={`cursor-pointer px-6 py-2 rounded-xl ${activePage === "admins" ? "bg-primary text-white" : ""}`}
            onClick={() => setActivePage("admins")}>
            Admins
          </button>
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

    </main>
  )
}