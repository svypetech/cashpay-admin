"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState, useRef } from "react"
import DisputeDetailsCard from "./DisputeDetailsCard";
import DisputeResolutionPopup from "./ResolveDisputePopup";

interface Trade {
    disputeId: string;
    tradeId: string;
    reason: string;
    status: string;
    chatHistory: string; // URL or identifier for chat history
}

interface Props {
    headings: string[]
    data: Trade[]
}

const P2PTableDisputed: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showResolvePopup, setShowResolvePopup] = useState(false)
    const [favor, setFavor] = useState<string>("")
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
    const [filteredTrades, setFilteredTrades] = useState<Trade[]>(data)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setFilteredTrades(data)
    }, [data])

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown !== null) {
                const target = event.target as HTMLElement
                if (!target.closest(".dropdown-container")) {
                    setActiveDropdown(null)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [activeDropdown])

    useEffect(() => {
        // Adjust dropdown position
        if (activeDropdown !== null && tableRef.current && dropdownRefs.current[activeDropdown]) {
            const tableRect = tableRef.current.getBoundingClientRect()
            const dropdownRect = dropdownRefs.current[activeDropdown]!.getBoundingClientRect()
            const rowElement = dropdownRefs.current[activeDropdown]!.closest("tr")
            const rowRect = rowElement?.getBoundingClientRect()

            if (rowRect && dropdownRect) {
                const spaceBelow = tableRect.bottom - rowRect.bottom
                const dropdownHeight = dropdownRect.height

                // Always open dropdown downwards for the first row or single row
                if (activeDropdown === 0 || data.length === 1) {
                    dropdownRefs.current[activeDropdown]!.style.top = "100%"
                    dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
                    dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
                    dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
                } else {
                    // For other rows with multiple rows, open upwards if not enough space below
                    if (spaceBelow < dropdownHeight) {
                        dropdownRefs.current[activeDropdown]!.style.bottom = "100%"
                        dropdownRefs.current[activeDropdown]!.style.top = "auto"
                        dropdownRefs.current[activeDropdown]!.style.marginBottom = "8px"
                        dropdownRefs.current[activeDropdown]!.style.marginTop = "0"
                    } else {
                        // Open downwards
                        dropdownRefs.current[activeDropdown]!.style.top = "100%"
                        dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
                        dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
                        dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
                    }
                }
            }
        }
    }, [activeDropdown, data.length])

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index)
    }

    const handleView = (trade: Trade) => {
        if (selectedTrade && selectedTrade.tradeId === trade.tradeId) {
            setSelectedTrade(null)
            setFilteredTrades(data)
            setActiveDropdown(null)
        } else {
            setSelectedTrade(trade)
            setFilteredTrades([trade])
            setActiveDropdown(null)
        }
    }

    const handleResolve = (type: string) => {
        setShowResolvePopup(true)
        setActiveDropdown(null)
        setFavor(type)
    }

    const handleSubmit = (comments: string) => {
        setIsSubmitting(true)
        // Simulate a network request
        setTimeout(() => {
            setIsSubmitting(false)
            console.log("Dispute resolved successfully!")
            console.log("Dispute ID:", selectedTrade?.disputeId)
            console.log("Comments:", comments)
            console.log("Favor:", favor)
            setShowResolvePopup(false)
        }, 2000)
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full min-h-[150px]" ref={tableRef}>
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
                        {Array.isArray(filteredTrades) &&
                            filteredTrades.map((trade, index) => (
                                <tr key={index} className="border-b text-[12px] md:text-[16px]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">{trade.disputeId}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{trade.tradeId}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px]">
                                        <span className="text-[12px] md:text-[16px] px-4 py-2 rounded-xl text-xs md:text-base font-semibold bg-[#DF1D1D33] text-[#DF1D1D]">
                                            {trade.reason}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                                        <span className="text-[12px] md:text-[16px] px-4 py-2 rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]">
                                            {trade.status}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                                        <span className="text-[12px] md:text-[16px] px-4 py-2 text-primary underline decoration-primary cursor-pointer">
                                            {trade.chatHistory}
                                        </span>
                                    </td>
                                    <td className="relative px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">
                                        <div className="dropdown-container relative">
                                            <button
                                                className="absolute right-0 md:relative md:right-auto cursor-pointer"
                                                onClick={() => toggleDropdown(index)}
                                            >
                                                <Image
                                                    src="/icons/options.svg"
                                                    alt="Options"
                                                    width={24}
                                                    height={24}
                                                    className="w-4 h-4"
                                                />
                                            </button>

                                            {activeDropdown === index && (
                                                <div
                                                    className="absolute z-10 right-0 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                                                    ref={(el) => {
                                                        dropdownRefs.current[index] = el;
                                                    }}
                                                >
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleView(trade)}
                                                    >
                                                        {selectedTrade ? "Back to all Trades" : "View Details"}
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleResolve("buyer")}
                                                    >
                                                        Resolve in Favour of Buyer
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleResolve("seller")}
                                                    >
                                                        Resolve in Favour of Seller
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Dispute Details of Buyer and Seller */}
            {selectedTrade && (
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                    <div>
                        <DisputeDetailsCard
                            avatarUrl="/images/user-avatar.png"
                            name="John Doe"
                            userId="CP-001"
                            email="johndoe@gmail.com"
                            joiningDate="19-03-20"
                            tradeCount={15}
                            successRate={95}
                            buttonText="Resolve: in Favor of Buyer"
                            onButtonClick={() => handleResolve("buyer")}
                        />
                    </div>
                    <div>
                        <DisputeDetailsCard
                            title="Seller Details"
                            avatarUrl="/images/user-avatar.png"
                            name="Jane Smith"
                            userId="CP-002"
                            email="janesmith@gmail.com"
                            joiningDate="22-05-20"
                            tradeCount={42}
                            successRate={98}
                            buttonText="Resolve: in Favor of Seller"
                            onButtonClick={() => handleResolve("seller")}
                        />
                    </div>
                </div>
            )}

            {/* Resolve Dispute Popup */}
            {showResolvePopup && (
                <DisputeResolutionPopup
                    isOpen={showResolvePopup}
                    onClose={() => setShowResolvePopup(false)}
                    disputeId="1001"
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    )
}

export default P2PTableDisputed;