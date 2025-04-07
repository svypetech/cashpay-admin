"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

type NavItem = {
  name: string
  href: string
  icon: string
  activeIcon: string
}

export default function Footer() {
  const pathname = usePathname()

  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: "/icons/footer-dashboard.svg", activeIcon: "/icons/footer-dashboard-active.svg" },
    { name: "Users", href: "/users", icon: "/icons/footer-users.svg", activeIcon: "/icons/footer-users-active.svg" },
    { name: "Transactions", href: "/transactions", icon: "/icons/footer-transactions.svg", activeIcon: "/icons/footer-transactions-active.svg" },
    { name: "Support", href: "/support", icon: "/icons/footer-support.svg" , activeIcon: "/icons/footer-support-active.svg" },
    { name: "Monitoring", href: "/monitoring", icon: "/icons/footer-monitoring.svg" , activeIcon: "/icons/footer-monitoring-active.svg" },
  ]

  return (
    <footer className="flex justify-center items-center w-ful p-2 pb-8">
      <div className="flex justify-between items-center bg-white rounded-2xl border-[1px] border-[#0000001A]  w-full max-w-[600px] p-5">
        {navigation.map((item) => {
            const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-2 py-1 ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Image src={isActive ? item.activeIcon : item.icon} alt={item.name} width={60} height={60} />
            </Link>
          )
        })}
      </div>
    </footer>
  )
}