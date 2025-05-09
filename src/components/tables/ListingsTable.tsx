"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import TransactionManagementPopup from "../transaction/TransactionManagementPopup"
import Image from "next/image";

interface Listing {
    listingID: string;
    sellerID: string;
    buyerID: string;
    type: string;
    currency: string;
    status: string;
}

interface Props {
    headings: string[]
    data: Listing[]
}

const ListingsTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

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

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto overflow-x-auto    min-w-[600px]">
                    <thead className="bg-secondary/10">
                        <tr className="whitespace-nowrap text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="px-2 md:px-4 py-3 md:py-4 text-left">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((listing, index) => (
                                <tr key={index} className="border-b text-[12px] md:text-[16px] font-[satoshi]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap font-bold text-primary min-w-[100px] break-words">{listing.listingID}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px] break-words">
                                        {listing.sellerID}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">{listing.buyerID}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">{listing.type}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">{listing.currency}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px]">
                                        {listing.status === "active" && (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Active
                                            </span>
                                        )}
                                        {listing.status === "inactive" && (
                                            <span className="text-[#FF0000] bg-[#FF000033] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] text-center">
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
                                                    className="absolute z-10 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                                                    ref={(el) => {
                                                        dropdownRefs.current[index] = el;
                                                    }}
                                                >
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setSelectedListing(listing)
                                                            setShowPopup(true)
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => { }}
                                                    >
                                                        Delete Listing
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

            {/* @ts-ignore Transaction Details Popup */}
            {/* <TransactionManagementPopup showPopup={showPopup} onClose={() => setShowPopup(false)} transaction={selectedListing} /> */}
        </div>
    )
}

export default ListingsTable;