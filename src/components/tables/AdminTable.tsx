"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import AdminSidebar from "@/src/components/admins/AdminSidebar"
import ConfirmModal from "../ui/ConfirmModal"
import { Admin } from "@/src/Types/Admin"
import { formatJoiningDate } from "@/src/lib/functions"
import { handleSuspendAdmin, handleBanAdmin, handleActivateAdmin } from "@/src/hooks/admins/AdminActions"

interface Props {
    headings: string[]
    data: Admin[]
    setData: React.Dispatch<React.SetStateAction<Admin[]>>
}

const AdminTable: React.FC<Props> = ({ data, headings, setData }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showAdminSidebar, setShowAdminSidebar] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    
    // Local state to track admin statuses for real-time updates
    const [adminStatuses, setAdminStatuses] = useState<{[key: string]: string}>({})

    // Confirmation modal states
    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [showBanModal, setShowBanModal] = useState(false)
    const [showActivateModal, setShowActivateModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Track data changes and update local admin statuses
    useEffect(() => {
        console.log("AdminTable data changed:", data)
        const statusMap: {[key: string]: string} = {}
        data.forEach(admin => {
            statusMap[admin._id] = admin.userStatus || "Active"
        })
        setAdminStatuses(statusMap)
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
        setSelectedIndex(index)
        setActiveDropdown(activeDropdown === index ? null : index)
    }

    const handleViewAdmin = (admin: Admin) => {
        setSelectedAdmin(admin)
        setShowAdminSidebar(true)
        setActiveDropdown(null)
    }

    // Handle suspend admin confirmation
    const handleSuspendConfirmation = (adminId: string) => {
        setShowSuspendModal(true)
        setActiveDropdown(null)
        setSelectedAdmin(data.find(admin => admin._id === adminId) || null)
    }

    // Handle ban admin confirmation
    const handleBanConfirmation = (adminId: string) => {
        setShowBanModal(true)
        setActiveDropdown(null)
        setSelectedAdmin(data.find(admin => admin._id === adminId) || null)
    }

    // Handle activate admin confirmation
    const handleActivateConfirmation = (adminId: string) => {
        setShowActivateModal(true)
        setActiveDropdown(null)
        setSelectedAdmin(data.find(admin => admin._id === adminId) || null)
    }

    // Execute suspend admin
    const executeSuspendAdmin = async (id: string) => {
        setIsSubmitting(true)
        try {
            await handleSuspendAdmin(id)
            alert("Admin suspended successfully.")
            
            // Update both data and local status immediately
            setData((prevAdmins) =>
                prevAdmins.map((admin) =>
                    admin._id === id
                        ? { ...admin, userStatus: "Suspended" }
                        : admin
                )
            );
            
            // Update local status for immediate UI response
            setAdminStatuses(prev => ({
                ...prev,
                [id]: "Suspended"
            }))
        } catch (error) {
            console.error("Error suspending admin:", error)
            alert("Failed to suspend admin. Please try again later.")
        } finally {
            setIsSubmitting(false)
            setShowSuspendModal(false)
        }
    }

    // Execute ban admin
    const executeBanAdmin = async (id: string) => {
        setIsSubmitting(true)
        try {
            await handleBanAdmin(id)
            alert("Admin banned successfully.")
            
            // Update both data and local status immediately
            setData((prevAdmins) =>
                prevAdmins.map((admin) =>
                    admin._id === id
                        ? { ...admin, userStatus: "Banned" }
                        : admin
                )
            );
            
            // Update local status for immediate UI response
            setAdminStatuses(prev => ({
                ...prev,
                [id]: "Banned"
            }))
        } catch (error) {
            console.error("Error banning admin:", error)
            alert("Failed to ban admin. Please try again later.")
        } finally {
            setIsSubmitting(false)
            setShowBanModal(false)
        }
    }

    // Execute activate admin
    const executeActivateAdmin = async (id: string) => {
        setIsSubmitting(true)
        try {
            await handleActivateAdmin(id)
            alert("Admin activated successfully.")
            
            // Update both data and local status immediately
            setData((prevAdmins) =>
                prevAdmins.map((admin) =>
                    admin._id === id
                        ? { ...admin, userStatus: "Active" }
                        : admin
                )
            );
            
            // Update local status for immediate UI response
            setAdminStatuses(prev => ({
                ...prev,
                [id]: "Active"
            }))
        } catch (error) {
            console.error("Error activating admin:", error)
            alert("Failed to activate admin. Please try again later.")
        } finally {
            setIsSubmitting(false)
            setShowActivateModal(false)
        }
    }

    const handleDeleteAdmin = (admin: Admin) => {
        console.log("Delete admin:", admin)
        setActiveDropdown(null)
    }

    // Calculate if we need padding based on current state
    const needsPadding = activeDropdown !== null && (
        selectedIndex >= (data.length - 3) || // Last three rows due to longer dropdown
        data.length <= 2 // If there are 2 or fewer rows, always add padding
    );

    // Helper function to get current admin status (prioritizes local state)
    const getCurrentAdminStatus = (adminId: string) => {
        return adminStatuses[adminId] || "Active"
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table - Add dynamic padding for dropdown space */}
            <div className={`rounded-lg overflow-x-auto w-full ${needsPadding ? "pb-40" : ""}`}>
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
                            data.map((admin, index) => {
                                // Get current status from local state for real-time updates
                                const currentStatus = getCurrentAdminStatus(admin._id)
                                
                                return (
                                    <tr key={index} className="border-b border-gray-200 text-[12px] md:text-[16px]">
                                        <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">{admin.id}</td>
                                        <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                            {admin.name ? admin.name : "N/A"}
                                        </td>
                                        <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">{admin.email}</td>
                                        <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">{formatJoiningDate(admin.date)}</td>
                                        <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">{admin.role}</td>
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
                                                            onClick={() => handleViewAdmin(admin)}
                                                        >
                                                            View
                                                        </button>
                                                        <div className="border-t border-gray-100"></div>
                                                        
                                                        {/* Dynamic dropdown options based on current status */}
                                                        {currentStatus === "Active" && (
                                                            <>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                                    onClick={() => handleSuspendConfirmation(admin._id)}
                                                                >
                                                                    Suspend Admin
                                                                </button>
                                                                <button
                                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                                    onClick={() => handleBanConfirmation(admin._id)}
                                                                >
                                                                    Ban Admin
                                                                </button>
                                                            </>
                                                        )}
                                                        
                                                        {currentStatus !== "Active" && (
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                                onClick={() => handleActivateConfirmation(admin._id)}
                                                            >
                                                                Activate Admin
                                                            </button>
                                                        )}
                                                        
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                            onClick={() => handleDeleteAdmin(admin)}
                                                        >
                                                            Delete Admin
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Admin Profile Sidebar */}
            {selectedAdmin && (
                <AdminSidebar
                    showSidebar={showAdminSidebar}
                    onClose={() => setShowAdminSidebar(false)}
                    admin={selectedAdmin}
                    currentStatus={getCurrentAdminStatus(selectedAdmin._id)}
                    setData={setData}
                    onStatusUpdate={(adminId: string, newStatus: string) => {
                        setAdminStatuses(prev => ({
                            ...prev,
                            [adminId]: newStatus
                        }))
                    }}
                />
            )}

            {/* Activate Admin Confirmation Modal */}
            <ConfirmModal
                isOpen={showActivateModal}
                onClose={() => !isSubmitting && setShowActivateModal(false)}
                onConfirm={() => executeActivateAdmin(selectedAdmin?._id || "")}
                title="Activate Admin"
                message="Are you sure you want to activate this admin? They will regain access to their admin account."
                warningText="This action will restore the admin's account access."
                cancelText="Cancel"
                confirmText="Activate Admin"
                isLoading={isSubmitting}
                style="blue"
            />

            {/* Suspend Admin Confirmation Modal */}
            <ConfirmModal
                isOpen={showSuspendModal}
                onClose={() => !isSubmitting && setShowSuspendModal(false)}
                onConfirm={() => executeSuspendAdmin(selectedAdmin?._id || "")}
                title="Suspend Admin"
                message="Are you sure you want to suspend this admin? They will lose access to their admin account temporarily."
                warningText="This action can be reversed later."
                cancelText="Cancel"
                confirmText="Suspend Admin"
                isLoading={isSubmitting}
                style="red"
            />

            {/* Ban Admin Confirmation Modal */}
            <ConfirmModal
                isOpen={showBanModal}
                onClose={() => !isSubmitting && setShowBanModal(false)}
                onConfirm={() => executeBanAdmin(selectedAdmin?._id || "")}
                title="Ban Admin"
                message="Are you sure you want to ban this admin? They will lose access to their admin account permanently."
                warningText="This action is permanent and cannot be undone."
                cancelText="Cancel"
                confirmText="Ban Admin"
                isLoading={isSubmitting}
                style="red"
            />
        </div>
    )
}

export default AdminTable