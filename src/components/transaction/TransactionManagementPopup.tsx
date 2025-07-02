"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Copy } from "lucide-react"
import Transaction from "@/src/Types/TransactionManagement"
import { shortenAddress, timeAgo } from "@/src/lib/functions"

interface TransactionDetailsPopupProps {
  showPopup: boolean
  onClose: () => void
  transaction: Transaction
}

export default function TransactionManagementPopup({
  showPopup,
  onClose,
  transaction,
}: TransactionDetailsPopupProps) {
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

  // Handle copying to clipboard with feedback
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
            <h3 className="text-xl font-semibold text-gray-900 mb-5 mt-6">Transaction Details</h3>
            
            {/* Currency Icon */}
            <div className={"mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#27AAE11A]"}>
              <Image
                src="/icons/dashboard2.svg"
                alt="Transaction icon"
                width={80}
                height={80}
                className="h-full w-full rounded-full"
              />
            </div>

            {/* Transaction Number */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-semibold max-w-[280px] truncate">
                  {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.hash, 10): "N/A"}
                </p>
                <button 
                  onClick={() => copyToClipboard(transaction.web3Data ? transaction.web3Data.transaction.hash : "", 'hash')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {copiedField === 'hash' ? (
                    <span className="text-xs text-green-500">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Transaction-ID: {transaction.id}</p>
            </div>

            {/* Transaction Details */}
            <div className="flex flex-col items-start gap-x-4 w-full mb-4">
            <div className="space-y-3"> 
              {/* To address */}
              <div className="flex flex-row sm:items-start gap-2">
                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 rounded-md">To</span>
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  <span className="text-sm text-gray-800 truncate">
                    {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.to, 8) : "N/A"}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(transaction.web3Data ? transaction.web3Data.transaction.to : "", 'to')}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    {copiedField === 'to' ? (
                      <span className="text-xs text-green-500">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* From address */}
              <div className="flex flex-row sm:items-start gap-2">
                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 rounded-md">From</span>
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  <span className="text-sm text-gray-800 truncate">
                    {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.from, 8) : "N/A"}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(transaction.web3Data ? transaction.web3Data.transaction.from : "", 'from')}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    {copiedField === 'from' ? (
                      <span className="text-xs text-green-500">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-row sm:items-center gap-2">
                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 rounded-md">Status</span>
                <span className={`text-sm text-gray-600 font-semibold ${transaction.status.toLowerCase() === 'completed' ? 'text-green-500' : transaction.status.toLowerCase() === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}></span>
              </div>

              {/* Block */}
              <div className="flex flex-row sm:items-start gap-2">
                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 rounded-md">Block</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800">
                    {transaction.web3Data ? transaction.web3Data.transaction.blockNumber || "N/A" : "N/A"}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-row sm:items-center gap-2">
                <span className="w-28 text-sm font-bold bg-[#27AAE11A] px-4 py-1 rounded-md">Date</span>
                <span className="text-sm text-gray-800">{timeAgo(transaction.date)}</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}