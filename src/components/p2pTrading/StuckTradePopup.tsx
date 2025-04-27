"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface PopupProps {
    showPopup: boolean
    onClose: () => void
    trade: {
        hash: string;
        tradeId: string;
        sellerId: string;
        buyerId: string;
        amount: number;
        currency: string;
        reason: string;
        status: string;
    }
}

export default function StuckTradePopup({
    showPopup,
    onClose,
    trade,
}: PopupProps) {
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
            <div className="relative max-h-full w-full max-w-md md:max-w-lg">
                {/* Popup Content */}
                <div className="relative rounded-2xl bg-white shadow-lg">
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-5 mt-10">Trade Details</h3>
                        {/* Currency Icon */}
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full`}>
                            <Image
                                src={`${trade.currency === "BTC" ? "/icons/bitcoin.svg" : trade.currency === "ETH" ? "/icons/ethereum.svg" : "/icons/tether.svg"}`}
                                alt="Bitcoin"
                                width={80}
                                height={80}
                                className="h-full w-full rounded-full"
                            />
                        </div>

                        {/* Transaction Number */}
                        <div className="mb-6 text-center">
                            <p className="text-md font-semibold">Trade#{trade.hash}</p>
                            <p className="text-xs text-gray-500">Trade-ID: {trade.tradeId}</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="space-y-1   ">
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Seller ID</span>
                                <span className="text-sm text-gray-800">{trade.sellerId}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Buyer ID</span>
                                <span className="text-sm text-gray-800">{trade.buyerId}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Amount</span>
                                <span className="text-sm text-gray-800">{trade.amount}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Reason</span>
                                <span className={`text-sm text-red-500 font-bold`}>
                                    {trade.reason}
                                </span>
                            </div>
                            <div className="flex gap-8">
                                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1">Status</span>
                                <span className="text-sm text-gray-800">{trade.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* action buttons */}
                    <div className="flex gap-4 w-full justify-between px-10 md:px-16 pb-8">
                            <button className=" flex justify-center items-center gap-2 px-5 py-2 text-xs border border-primary rounded-xl text-primary bg-white hover:bg-primary-50">
                                Release Escrow
                            </button>
                            <button className="flex justify-center items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-primary hover:bg-blue-900">
                                Cancel Transaction
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}
