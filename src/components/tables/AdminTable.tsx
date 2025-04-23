"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDarkMode } from "../../app/(auth)/signin/context/DarkModeContext"
import Image from "next/image"
import UserProfileSidebar from "../users/UserInfoSidebar"
import AdminSidebar from "../admins/AdminSidebar"

interface Admin {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
    status: string;
    role: string;
    profile?: string;
}

interface Props {
    headings: string[]
    data: Admin[]
}

const AdminTable: React.FC<Props> = ({ data, headings }) => {
    const { darkMode } = useDarkMode() // Get dark mode state
    const [showDark, setShowDark] = useState(darkMode)
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showAdminSidebar, setShowAdminSidebar] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
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

    const handleViewAdmin = (admin: Admin) => {
        setSelectedAdmin(admin)
        setShowAdminSidebar(true)
        setActiveDropdown(null)
    }

    const handleSuspendAdmin = (admin: Admin) => {
        console.log("Suspend admin:", admin)
        setActiveDropdown(null)
    }

    const handleBanAdmin = (admin: Admin) => {
        console.log("Ban admin:", admin)
        setActiveDropdown(null)
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto min-w-[600px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] md:text-[16px] p-2 md:p-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="p-2 md:p-4 text-left">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((admin, index) => (
                                <tr key={index} className="border-b text-[12px] md:text-[16px]">
                                    <td className="p-2 md:p-4 font-satoshi min-w-[100px] break-words">{admin.id}</td>
                                    <td className="p-2 md:p-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                        {admin.name}
                                    </td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[150px] break-words">{admin.email}</td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[120px]">{admin.joinedDate}</td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[120px]">{admin.status}</td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[120px]">{admin.role}</td>
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
                                                        onClick={() => handleViewAdmin(admin)}
                                                    >
                                                        View
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSuspendAdmin(admin)}
                                                    >
                                                        Suspend Admin
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleBanAdmin(admin)}
                                                    >
                                                        Ban Admin
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleBanAdmin(admin)}
                                                    >
                                                        Delete Admin
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

            {/* Admin Profile Sidebar */}
            {selectedAdmin && (
                <AdminSidebar
                    showSidebar={showAdminSidebar}
                    onClose={() => setShowAdminSidebar(false)}
                    admin={{
                        id: selectedAdmin.id,
                        profileImage: selectedAdmin.profile || "/images/user-avatar.png",
                        name: selectedAdmin.name,
                        email: selectedAdmin.email,
                        joiningDate: selectedAdmin.joinedDate,
                        status: selectedAdmin.status,
                        role: selectedAdmin.role,
                    }}
                />
            )}
        </div>
    )
}

export default AdminTable