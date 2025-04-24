"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface TransactionDetailsPopupProps {
    showPopup: boolean
    onClose: () => void
    transaction: {
      hash: string
      id: string
      to: string
      from: string
      status: "Pending" | "Completed" | "Failed"
      block: string
      date: string
    }
  }

export default function TransactionManagementPopup({
    showPopup,
    onClose,
    transaction,
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
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
            <div className="relative max-h-full w-full max-w-md">
                {/* Popup Content */}
                <div className="relative rounded-lg bg-white shadow-lg">
                    {/* Header */}

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute cursor-pointer right-7 top-7 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-black hover:scale-105 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>


                    {/* Body */}
                    <div className="flex flex-col items-center p-6 font-[satoshi]">
                        <h3 className="text-xl font-semibold text-gray-900 mb-5 mt-10">Transaction Details</h3>
                        {/* Currency Icon */}
                        <div className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#27AAE11A]`}>
                            <Image
                                src="/icons/dashboard2.svg"
                                alt="Transaction icon"
                                width={100}
                                height={100}
                                className="h-full w-full rounded-full"
                            />
                        </div>

                        {/* Transaction Number */}
                        <div className="mb-6 text-center">
                            <p className="text-md font-semibold">{transaction.hash}</p>
                            <p className="text-xs text-gray-500">Transaction-ID: {transaction.id}</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-1   ">
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">To</span>
                                <span className="text-sm text-gray-800">{transaction.to}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">From</span>
                                <span className="text-sm text-gray-800">{transaction.from}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Status</span>
                                <span className={`text-sm text-gray-800`}>{transaction.status}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Block</span>
                                <span className="text-xs text-gray-800">{transaction.block}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">date</span>
                                <span className="text-xs text-gray-800">{transaction.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
