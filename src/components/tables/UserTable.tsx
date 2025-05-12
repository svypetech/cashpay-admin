"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

import UserProfileSidebar from "../users/UserProfileSidebar"
import Image from "next/image"
import ColourfulBlock from "../ui/ColourfulBlock"
import { User } from "@/src/Types/User"
import handleSuspendUser from "@/src/hooks/users/suspendUser"
import handleBanUser from "@/src/hooks/users/banUser"

interface Props {
    headings: string[]
    data: User[]
    setData: React.Dispatch<React.SetStateAction<User[]>>
}


function formatDate(dateString: string): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';

        // Format with locale then replace slashes with hyphens
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');

    } catch (error) {
        return 'Invalid date format';
    }
}

const UserTable: React.FC<Props> = ({ data, headings, setData }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showUserSidebar, setShowUserSidebar] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
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
        // Adjust dropdown position for the last few rows
        if (activeDropdown !== null && tableRef.current && dropdownRefs.current[activeDropdown]) {
            const tableRect = tableRef.current.getBoundingClientRect()
            const dropdownRect = dropdownRefs.current[activeDropdown]!.getBoundingClientRect()
            const rowElement = dropdownRefs.current[activeDropdown]!.closest("tr")
            const rowRect = rowElement?.getBoundingClientRect()

            if (rowRect && dropdownRect) {
                const spaceBelow = tableRect.bottom - rowRect.bottom
                const dropdownHeight = dropdownRect.height

                // If there's not enough space below, open the dropdown upwards
                if (spaceBelow < dropdownHeight) {
                    dropdownRefs.current[activeDropdown]!.style.bottom = "100%"
                    dropdownRefs.current[activeDropdown]!.style.top = "auto"
                    dropdownRefs.current[activeDropdown]!.style.marginBottom = "8px"
                    dropdownRefs.current[activeDropdown]!.style.marginTop = "0"
                } else {
                    // Otherwise, open downwards (default)
                    dropdownRefs.current[activeDropdown]!.style.top = "100%"
                    dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
                    dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
                    dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
                }
            }
        }
    }, [activeDropdown])

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index)
    }

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setShowUserSidebar(true)
        setActiveDropdown(null)
    }

    return (
        <div className="flex-1 rounded-lg w-full   py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto min-w-[700px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
                            <th className="p-2 sm:p-5 text-left font-[700] w-[12%]">
                                {headings[0]}
                            </th>
                            <th className="p-2 sm:p-5 text-left font-[700] w-[15%]">
                                {headings[1]}
                            </th>
                            <th className="p-2 sm:p-5 text-left font-[700] w-[23%]">
                                {headings[2]}
                            </th>
                            <th className="p-2 sm:p-5 text-left font-[700] w-[20%]">
                                {headings[3]}
                            </th>
                            <th className="p-2 sm:p-5 text-left font-[700] w-[20%]">
                                {headings[4]}
                            </th>
                            <th className="p-2 sm:p-5 text-left font-[700] w-[10%]">
                                {headings[5]}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((user, index) => (
                                <tr key={index} className="border-b border-gray-200 text-[12px] sm:text-[16px]">
                                    <td className="p-2 sm:p-5 font-satoshi min-w-[100px] break-words whitespace-nowrap">{user._id}</td>
                                    <td className="p-2 sm:p-5 font-satoshi font-bold text-primary min-w-[120px] break-words whitespace-nowrap">
                                        {user.name ? user.name?.firstName + " " + user.name?.lastName : "N/A"}
                                    </td>
                                    <td className="p-2 sm:p-5 font-satoshi min-w-[150px] break-words whitespace-nowrap">{user.email ? user.email : "N/A"}</td>
                                    <td className="p-2 sm:p-5 font-satoshi min-w-[100px] whitespace-nowrap">{formatDate(user.date)}</td>
                                    <td className="p-2 sm:p-5 font-satoshi min-w-[120px] py-[20px]">


                                        <ColourfulBlock
                                            text={user.verificationStatus}
                                            className={`text-left rounded-xl  md:text-md font-semibold whitespace-nowrap ${user.verificationStatus === "Approved" ? "bg-[#71FB5533] text-[#20C000]" : "text-[#727272] bg-[#72727233]"
                                                }`}


                                        />
                                    </td>
                                    <td className="relative p-2 sm:p-5 font-satoshi min-w-[60px] text-center">
                                        <div className="dropdown-container relative">
                                            <button
                                                className="absolute z-70 right-0 md:relative md:right-auto cursor-pointer"
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
                                                    className="absolute z-80  right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                                                    ref={(el) => {
                                                        dropdownRefs.current[index] = el;
                                                    }}
                                                >
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleViewUser(user)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setActiveDropdown(null)
                                                            handleSuspendUser(user._id)
                                                        }}
                                                    >
                                                        Suspend User
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setActiveDropdown(null)
                                                            handleBanUser(user._id)
                                                        }}
                                                    >
                                                        Ban User
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

            {/* User Profile Sidebar */}
            {selectedUser && (
                <UserProfileSidebar
                    setData={setData}
                    showSidebar={showUserSidebar}
                    onClose={() => {
                        setShowUserSidebar(false)
                        setSelectedUser(null)
                    }}
                    user={{
                        ...selectedUser,
                        date: formatDate(selectedUser.date),
                    }}
                />
            )}
        </div>
    )
}

export default UserTable