"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"
import UserProfileSidebar from "../users/UserInfoSidebar"
import Image from "next/image"

interface User {
    id: string
    name: string
    email: string
    joinedDate: string
    status: string
    profile: string
}

interface Props {
    headings: string[]
    data: User[]
}

const UserTable: React.FC<Props> = ({ data, headings }) => {
    const { darkMode } = useDarkMode() // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode)
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showUserSidebar, setShowUserSidebar] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        // Delay state update slightly to enable smooth transition
        const timeout = setTimeout(() => setShowDark(darkMode), 100)
        return () => clearTimeout(timeout)
    }, [darkMode])

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
                if (activeDropdown === 0 || activeDropdown === 1 || data.length === 2) {
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

    const handleViewUser = (user: User) => {
        setSelectedUser(user)
        setShowUserSidebar(true)
        setActiveDropdown(null)
    }

    const handleSuspendUser = (user: User) => {
        console.log("Suspend user:", user)
        setActiveDropdown(null)
    }

    const handleBanUser = (user: User) => {
        console.log("Ban user:", user)
        setActiveDropdown(null)
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full min-h-[200px]" ref={tableRef}>
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
                            data.map((user, index) => (
                                <tr key={index} className="border-b text-[12px] md:text-[16px]">
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">{user.id}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                        {user.name}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">{user.email}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">{user.joinedDate}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                                        {user.status === "Verified" ? (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Pending
                                            </span>
                                        )}
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
                                                    className="absolute z-10 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
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
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSuspendUser(user)}
                                                    >
                                                        Suspend User
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleBanUser(user)}
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
                    showSidebar={showUserSidebar}
                    onClose={() => setShowUserSidebar(false)}
                    user={{
                        id: selectedUser.id,
                        profileImage: selectedUser.profile || "/images/user-avatar.png",
                        name: selectedUser.name,
                        email: selectedUser.email,
                        joiningDate: selectedUser.joinedDate,
                        status: selectedUser.status,
                    }}
                />
            )}
        </div>
    )
}

export default UserTable