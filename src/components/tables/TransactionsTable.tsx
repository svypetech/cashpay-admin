"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"
import TransactionManagementPopup from "../transaction/TransactionManagementPopup"

interface Transaction {
    hash: string
    id: string
    from: string
    to: string
    status: string
    block: string
    date: string
}

interface Props {
    headings: string[]
    data: Transaction[]
}

const TransactionTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto min-w-[600px]">
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
                                    }} className="border-b text-[12px] md:text-[16px] cursor-pointer">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">{transaction.id}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                        {transaction.from}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">{transaction.to}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                                        {transaction.status === "Completed" && (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Success
                                            </span>
                                        )}
                                        {transaction.status === "Pending" && (
                                            <span className="text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Pending
                                            </span>
                                        )}
                                        {transaction.status === "Failed" && (
                                            <span className="text-[#FF0000] bg-[#FF000033] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">{transaction.block}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">{transaction.date}</td>
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