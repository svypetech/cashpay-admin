"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
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
    const [filteredOrders, setFilteredOrders] = useState<CardOrder[]>(data)

    useEffect(() => {
        setFilteredOrders(data)
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
                        {Array.isArray(filteredOrders) &&
                            filteredOrders.map((order, index) => (
                                <tr key={index} className="border-b border-gray-200 text-[12px] md:text-[16px]">
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
                                                            const orderWithExtraData = { 
                                                                ...order, 
                                                                userID: "User123", 
                                                                userEmail: "johndoe@gmail.com", 
                                                                userName: "John Doe", 
                                                                userJoiningDate: "2023-01-01" 
                                                            }
                                                            setSelectedOrder(orderWithExtraData)
                                                            setShowSidebar(true)
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

            {/* Order Details Sidebar */}
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