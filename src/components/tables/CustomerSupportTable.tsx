"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
import AssignRequestDialog from "../CustomerSupport/AssignRequestDialog";
import { SupportRequest } from "@/src/Types/SupportRequests";
import { formatJoiningDate, shortenAddress } from "@/src/lib/functions";

interface Props {
    headings: string[]
    data: SupportRequest[]
}

const CustomerSupportTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
    const [customerRequests, setCustomerRequests] = useState<SupportRequest[]>(data)

    useEffect(() => {
        setCustomerRequests(data)
    }, [data])

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

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table - Add padding bottom for dropdown space */}
            <div className="rounded-lg overflow-x-auto w-full pb-32">
                <table className="w-full text-left table-auto font-[satoshi]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className={`px-2 md:px-4 py-3 md:py-4 ${heading === "Delivery Address" ? "text-center" : "text-left"}`}>
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customerRequests) &&
                            customerRequests.map((request, index) => (
                                <tr key={index} className="border-b border-gray-200 text-[12px] md:text-[16px]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{shortenAddress(request._id)}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{shortenAddress(request.userId)}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words"> - </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{formatJoiningDate(request.updateDate)}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px] break-words text-center">{request.issueType}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                                        <span className={`text-[12px] md:text-[16px] px-4 py-2 rounded-xl text-xs md:text-base font-semibold ${request.status === "Assigned" ? "bg-[#71FB5533] text-[#20C000]" : "bg-[#EFE40833] text-[#B0A700]"}`}>
                                            {request.status === "Assigned" ? "Assigned" : "Unassigned"}
                                        </span>
                                    </td>
                                    <td className="relative px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">
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
                                                            setSelectedRequest(request)
                                                            setShowPopup(true)
                                                            setActiveDropdown(null)
                                                        }}
                                                    >
                                                        View Details
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

            {/* Assign Request Popup */}
            {showPopup && (
                <AssignRequestDialog
                    isOpen={showPopup}
                    onCancel={() => setShowPopup(false)}
                    requestId={selectedRequest?._id} 
                    handleAssign={(agentId) => {
                        // Update the local state to show the request as assigned
                        setCustomerRequests((prevRequests) =>
                            prevRequests.map((req) =>
                                req._id === selectedRequest?._id
                                    ? { ...req, status: "assigned" }
                                    : req
                            )
                        );
                        setShowPopup(false);
                        setSelectedRequest(null);
                    }}
                />
            )}
        </div>
    )
}

export default CustomerSupportTable;