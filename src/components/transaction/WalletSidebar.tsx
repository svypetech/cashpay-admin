"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface WalletSidebarProps {
    showSidebar: boolean
    onClose: () => void
    wallet? : {
        userId: string
        name: string
        cardUser: boolean
        cryptoHoldings: number
        totalBalance: number
    }
}

export default function WalletSidebar({
    showSidebar,
    onClose,
    wallet,
}: WalletSidebarProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldSlideIn, setShouldSlideIn] = useState(false)

    // Handle animation and visibility states
    useEffect(() => {
        if (showSidebar) {
            setIsVisible(true) // Render the sidebar
            // Use a small timeout to ensure DOM is ready before starting animation
            setTimeout(() => {
                setShouldSlideIn(true) // Trigger slide-in animation
            }, 0)
            document.body.style.overflow = "hidden" // Prevent scrolling
        } else {
            setShouldSlideIn(false) // Start slide-out animation
            // Wait for animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setIsVisible(false)
                document.body.style.overflow = "auto" // Re-enable scrolling
            }, 300) // Match transition duration
            return () => clearTimeout(timer)
        }
    }, [showSidebar])

    // Clean up overflow style when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    if (!isVisible && !showSidebar) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay with fade animation */}
            <div 
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose} 
                aria-hidden="true" 
            />

            {/* Sidebar with slide animation */}
            <div 
                className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${shouldSlideIn ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-full flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 mt-5">
                        <h2 className="text-2xl font-semibold">User's Wallet</h2>
                        <button onClick={onClose} className="rounded-full cursor-pointer p-1 hover:bg-gray-100" aria-label="Close sidebar">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center mx-10 py-8 font-[satoshi] border-b border-gray-300">
                        {/* Profile Image */}
                        <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                            <Image
                                src={"/images/user-avatar.png"}
                                alt={wallet?.name || "User Avatar"}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* User Info */}
                        <h3 className="mb-1 text-xl font-semibold">{wallet?.name}</h3>
                        <p className="mb-6 text-xs text-gray-500">User ID: {wallet?.userId}</p>

                        {/* Total Balance in center and bold and flex col */}
                        <div className="flex flex-col mt-4">
                            <p className="text-lg font-semibold">Total Balance</p>
                            <p className="text-2xl font-bold text-primary">USD {wallet?.totalBalance.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Crypto Holdings */}
                    <div className="flex flex-col items-center mx-10 py-8 font-[satoshi] border-b border-gray-300">
                        <div className="flex flex-col w-full">
                            <CryptoCard
                                symbol="BTC"
                                amount={520}
                                usdValue={wallet?.totalBalance ? wallet.totalBalance : 0}
                                iconUrl="/icons/bitcoin.svg"
                            />
                            <CryptoCard
                                symbol="ETH"
                                amount={520}
                                usdValue={wallet?.totalBalance ? wallet.totalBalance : 0}
                                iconUrl="/icons/ethereum.svg"
                            />
                            <CryptoCard
                                symbol="USDT"
                                amount={520}
                                usdValue={wallet?.totalBalance ? wallet.totalBalance : 0}
                                iconUrl="/icons/tether.svg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface CryptoCardProps {
  symbol: string
  amount: number
  usdValue: number
  iconUrl: string
}

function CryptoCard({ symbol, amount, usdValue, iconUrl }: CryptoCardProps) {
  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={iconUrl || "/placeholder.svg"}
              alt={`logo`}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{symbol}</p>
            <p className="text-2xl font-bold text-blue-900">{amount}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-md text-primary">= {usdValue.toFixed(2)} <span className="font-bold">USD</span></p>
        </div>
      </div>
    </div>
  )
}