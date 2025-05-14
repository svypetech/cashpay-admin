"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Copy } from "lucide-react"
import { Listing } from "@/src/Types/P2PListing"
import { shortenAddress } from "@/src/lib/functions"



interface PopupProps {
    showPopup: boolean
    onClose: () => void
    listing: Listing
}

export default function ListingDetailsPopup({
    showPopup,
    onClose,
    listing,
}: PopupProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null)

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

    // Handle copying createdBy clipboard with feedback
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    if (!showPopup) return null

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
            <div className="relative  max-h-full w-full max-w-md">
                {/* Popup Content */}
                <div className="relative rounded-lg bg-white shadow-lg flex flex-col items-center">
                    {/* Header */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute cursor-pointer right-5 top-5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-sm text-black hover:scale-105 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close modal</span>
                    </button>

                    {/* Body */}
                    <div className="flex flex-col items-center p-6 font-[satoshi]">
                        <h3 className="text-xl font-semibold text-gray-900 mb-5 mt-6">Listing Details</h3>

                        {/* Currency Icon */}
                        <div className={"mb-4 flex gap-3 items-center justify-center"}>
                            <Image
                                src="/icons/bitcoin.svg"
                                alt="Transaction icon"
                                width={80}
                                height={80}
                                className="h-16 w-16 rounded-full"
                            />

                            <Image
                                src="/icons/double-arrows.svg"
                                alt="Transaction icon"
                                width={80}
                                height={80}
                                className="h-7 w-7 rounded-full"
                            />

                            <Image
                                src="/icons/USDT.svg"
                                alt="Transaction icon"
                                width={80}
                                height={80}
                                className="h-16 w-16 rounded-full"
                            />
                        </div>

                        {/* Transaction Number */}
                        <div className="mb-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-sm font-semibold max-w-[280px] truncate">
                                    {listing.id}
                                </p>
                                <button
                                    onClick={() => copyToClipboard(listing.id, 'id')}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {copiedField === 'id' ? (
                                        <span className="text-xs text-green-500">Copied!</span>
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[16px] font-[400] text-[#1D1D1D] mt-1">Buy</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="flex flex-col items-start gap-x-4 w-full mb-4">
                            <div className="space-y-2">
                                {/* To address */}
                                <div className="flex flex-row sm:items-start gap-2">
                                    <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 ">SellerID</span>
                                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                        <span className="text-sm text-gray-800 truncate">
                                            {shortenAddress(listing.createdBy)}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(listing.createdBy, 'createdBy')}
                                            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                                        >
                                            {copiedField === 'createdBy' ? (
                                                <span className="text-xs text-green-500">Copied!</span>
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* From address */}
                                

                                {/* Amount */}
                                <div className="flex flex-row sm:items-start gap-2">
                                    <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 ">Amount</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-800">
                                            {listing.offeredPrice}
                                        </span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex flex-row sm:items-center gap-2">
                                    <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 ">Status</span>
                                    <span className={`text-sm  font-semibold`}>
                                        {listing.addVisibility ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Payment */}
                                <div className="flex flex-row sm:items-center gap-2">
                                    <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 ">Payment</span>
                                    <span className="text-sm text-green-500">{listing.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}