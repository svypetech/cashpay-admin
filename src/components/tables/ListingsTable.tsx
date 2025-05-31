"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image";
import ListingDetailsPopup from "../p2pTrading/ListingPopup";
import { Listing } from "@/src/Types/P2PListing";
import axios from "axios";

interface Props {
    headings: string[]
    data: Listing[]
}

const ListingsTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedListing, setSelectedListing] = useState<Listing>({} as Listing)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getColumnWidthClass = (index: number): string => {
        switch (index) {
            case 0: return "w-[15%]"; // User ID
            case 1: return "w-[20%]"; // Username
            case 2: return "w-[15%]"; // Card User
            case 3: return "w-[20%]"; // Crypto Holdings
            case 4: return "w-[20%]"; // Total Balance
            case 5: return "w-[10%]"; // Actions
            default: return "w-[16.67%]"; // Equal distribution
        }
    };

    // Simple dropdown logic: close on outside click
    useEffect(() => {
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

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index)
    }

    const handleDeleteListing = async (listingId: string) => {
        try {
            setIsSubmitting(true)
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/add/${listingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            console.log("Response:", response.data)
            if (response.data.success) {
                alert("listing deleted successfully")
            }
            else {
                alert("Failed to delete listing")
            }
        } catch (error) {
            console.error("Error deleting:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table - Add padding bottom for dropdown space */}
            <div className="rounded-lg overflow-x-auto w-full pb-32">
                <table className="w-full text-left table-auto">
                    <thead className="bg-secondary/10">
                        <tr className="whitespace-nowrap text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className={`px-2 md:px-4 py-3 md:py-4 text-left ${getColumnWidthClass(index)}`}>
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((listing, index) => (
                                <tr key={listing.id} className="border-b border-gray-200 text-[12px] md:text-[16px] font-[satoshi]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap font-bold text-primary min-w-[100px] break-words">{listing.id}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px] break-words">
                                        {listing.createdBy}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">{listing.type}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">{listing.currency}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px]">
                                        {listing.addVisibility === true && (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-2 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap flex justify-center items-center w-[100px]">
                                                Active
                                            </span>
                                        )}
                                        {listing.addVisibility === false && (
                                            <span className="text-[#FF0000] bg-[#FF000033] px-2 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap flex justify-center items-center w-[100px]">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] text-center">
                                        <div className="dropdown-container relative inline-block">
                                            <button
                                                className="relative cursor-pointer"
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
                                                <div className="absolute z-10 right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setSelectedListing(listing)
                                                            setShowPopup(true)
                                                            setActiveDropdown(null)
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => { 
                                                            handleDeleteListing(listing.id)
                                                            setActiveDropdown(null)
                                                        }}
                                                    >
                                                        {isSubmitting ? "Deleting..." : "Delete Listing"}
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

            <ListingDetailsPopup showPopup={showPopup} onClose={() => setShowPopup(false)} listing={selectedListing} />
        </div>
    )
}

export default ListingsTable;