"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

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
    { name: "Cards", href: "/card-orders", icon: "/icons/footer-cards.svg" , activeIcon: "/icons/footer-cards-active.svg" }
  ]

  return (
    <>
      {/* Spacer to prevent content from hiding behind footer */}
      <div className="h-24 w-full"></div>
      
      <footer className="fixed bottom-0 flex justify-center items-center w-full p-2 pb-8 z-10 pointer-events-none">
        <div className="flex justify-between items-center bg-white rounded-2xl border-[1px] border-[#0000001A] w-[95%] sm:max-w-[600px] py-3 sm:py-5 px-3 sm:px-16 shadow-lg pointer-events-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1`}
              >
                <Image 
                  src={isActive ? item.activeIcon : item.icon} 
                  alt={item.name} 
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 30px, 60px"
                  className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px]" 
                />
                {/* <span className="text-xs mt-1">{item.name}</span> */}
              </Link>
            )
          })}
        </div>
      </footer>
    </>
  )
}