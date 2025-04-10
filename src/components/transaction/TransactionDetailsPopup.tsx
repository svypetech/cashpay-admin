"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface TransactionDetailsPopupProps {
    showPopup: boolean
    onClose: () => void
    transaction?: {
        id: string
        transactionNumber: string
        userId: string
        amount: number
        status: "Pending" | "Completed" | "Failed"
        timestamp: string
        currency: "BTC" | "ETH" | "USDT"
    }
}

export default function TransactionDetailsPopup({
    showPopup,
    onClose,
    transaction = {
        id: "TXN-001",
        transactionNumber: "192802",
        userId: "CP-001",
        amount: 1.35,
        status: "Pending",
        timestamp: "2025-03-10 10:00",
        currency: "BTC",
    },
}: TransactionDetailsPopupProps) {
    // Prevent body scrolling when popup is open
    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [showPopup])

    if (!showPopup) return null

    // Get currency icon and color
    const getCurrencyDetails = (currency: string) => {
        switch (currency) {
            case "BTC":
                return { bgColor: "bg-orange-400", icon: "₿" }
            case "ETH":
                return { bgColor: "bg-gray-400", icon: "Ξ" }
            case "USDT":
                return { bgColor: "bg-green-400", icon: "₮" }
            default:
                return { bgColor: "bg-blue-400", icon: "$" }
        }
    }

    const currencyDetails = getCurrencyDetails(transaction.currency)

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-amber-500 bg-amber-50"
            case "Completed":
                return "text-green-500 bg-green-50"
            case "Failed":
                return "text-red-500 bg-red-50"
            default:
                return "text-gray-500 bg-gray-50"
        }
    }

    const statusColor = getStatusColor(transaction.status)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
            <div className="relative max-h-full w-full max-w-md">
                {/* Popup Content */}
                <div className="relative rounded-lg bg-white shadow-lg">
                    {/* Header */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-7 top-7 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-black hover:scale-105 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>


                    {/* Body */}
                    <div className="flex flex-col items-center p-6 font-[satoshi]">
                        <h3 className="text-xl font-semibold text-gray-900 mb-5 mt-10">Transaction Details</h3>
                        {/* Currency Icon */}
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${currencyDetails.bgColor}`}>
                            {transaction.currency === "BTC" ? (
                                <Image
                                    src="/icons/bitcoin.svg"
                                    alt="Bitcoin"
                                    width={80}
                                    height={80}
                                    className="h-full w-full rounded-full"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-white">{currencyDetails.icon}</span>
                            )}
                        </div>

                        {/* Transaction Number */}
                        <div className="mb-6 text-center">
                            <p className="text-md font-semibold">Transaction#{transaction.transactionNumber}</p>
                            <p className="text-xs text-gray-500">Transaction-ID: {transaction.id}</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-1   ">
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">User ID</span>
                                <span className="text-sm text-gray-800">{transaction.userId}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Amount</span>
                                <span className="text-sm text-gray-800">{transaction.amount}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Status</span>
                                <span className={`text-sm text-red-500 font-bold`}>
                                    {transaction.status}
                                </span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Timestamp</span>
                                <span className="text-xs text-gray-800">{transaction.timestamp}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
