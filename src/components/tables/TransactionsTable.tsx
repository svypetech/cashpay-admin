"use client"

import type React from "react"
import { useState, useRef } from "react"
import TransactionManagementPopup from "../transaction/TransactionManagementPopup"
import Transaction from "@/src/Types/TransactionManagement"
import { shortenAddress, timeAgo } from "@/src/lib/functions"

interface Props {
    headings: string[]
    data: Transaction[]
}

const TransactionTable: React.FC<Props> = ({ data, headings }) => {
    const [showPopup, setShowPopup] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto overflow-x-auto    min-w-[600px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="px-2 md:px-4 py-3 md:py-4 text-left">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((transaction, index) => (
                                <tr key={index} onClick={() => {
                                    setSelectedTransaction(transaction)
                                    setShowPopup(true)
                                    }} className="border-b border-gray-200 text-[12px] md:text-[16px] cursor-pointer">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[100px] break-words">
                                        {transaction.id ? shortenAddress(transaction.id) : "N/A"}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                                        {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.from) : "N/A"}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">
                                        {transaction.web3Data ? shortenAddress(transaction.web3Data.transaction.to) : "N/A"}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">
                                        {transaction.amount ? (transaction.amount + " " + transaction.tokenName) : "N/A"}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                                        {transaction.status.toLowerCase() === "completed" && (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Success
                                            </span>
                                        )}
                                        {transaction.status.toLowerCase() === "pending" && (
                                            <span className="text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Pending
                                            </span>
                                        )}
                                        {transaction.status.toLowerCase() === "failed" && (
                                            <span className="text-[#FF0000] bg-[#FF000033] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] font-medium">
                                        {transaction.web3Data ? (transaction.web3Data.transaction.blockNumber) : "N/A"}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center whitespace-nowrap">{timeAgo(transaction.date)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* @ts-ignore Transaction Details Popup */}
            <TransactionManagementPopup showPopup={showPopup} onClose={() => setShowPopup(false)} transaction={selectedTransaction} />
        </div>
    )
}

export default TransactionTable;