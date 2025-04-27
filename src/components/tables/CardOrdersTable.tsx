"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState, useRef } from "react"
import OrderDetailsSidebar from "../cards/OrderDetailsSidebar";


interface CardOrder {
    orderID: string;
    userID: string;
    cardType: string;
    date: string;
    deliveryAddress: string;
    orderStatus: string;
    cardStatus: string;
    userEmail?: string; // Added userEmail as an optional property
    userName?: string; // Added userName as an optional property
    userJoiningDate?: string; // Added userJoinedDate as an optional property
}

interface Props {
    headings: string[]
    data: CardOrder[]
}

const CardOrdersTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showSidebar, setShowSidebar] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<CardOrder | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
    const [filteredOrders, setFilteredOrders] = useState<CardOrder[]>(data)

    useEffect(() => {
        setFilteredOrders(data)
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

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full min-h-[150px]" ref={tableRef}>
                <table className="w-full text-left table-auto min-w-[600px] font-[satoshi]">
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
                        {Array.isArray(filteredOrders) &&
                            filteredOrders.map((order, index) => (
                                <tr key={index} className="border-b text-[12px] md:text-[16px]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{order.orderID}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{order.userID}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{order.cardType}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">{order.date}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px] break-words text-center">{order.deliveryAddress}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                                        <span className={`text-[12px] md:text-[16px] px-4 py-2 rounded-xl text-xs md:text-base font-semibold ${order.orderStatus === "Dispatched" ? "bg-[#EFE40833] text-[#B0A700]" : order.orderStatus === "Completed" ? "bg-[#71FB5533] text-[#20C000]" : "bg-[#72727233] text-[#727272]"}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                                        <span className={`text-[12px] md:text-[16px] px-4 py-2 rounded-xl text-xs md:text-base font-semibold ${order.cardStatus === "Inactive" ? "bg-[#72727233] text-[#727272]" : "bg-[#71FB5533] text-[#20C000]"}`}>
                                            {order.cardStatus}
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
                                                        onClick={() => {
                                                            order = { ...order, userID: "User123", userEmail: "johndoe@gmail.com", userName: "John Doe", userJoiningDate: "2023-01-01" } // Example data
                                                            setSelectedOrder(order)
                                                            setShowSidebar(true)
                                                        }}
                                                    >
                                                        {"View Details"}
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    {/* <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {}}
                                                    >
                                                        Release Escrow
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#DF1D1D] font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {}}
                                                    >
                                                        Cancel Transaction
                                                    </button> */}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* order Details Popup */}
            {showSidebar && (
                <OrderDetailsSidebar // @ts-ignore
                    order={selectedOrder}
                    showSidebar={showSidebar}
                    onClose={() => setShowSidebar(false)}
                />
            )}
        </div>
    )
}

export default CardOrdersTable;