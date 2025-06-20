"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { formatJoiningDate } from "@/src/lib/functions"
import axios from "axios"
import { Admin } from "@/src/Types/Admin"
import ConfirmModal from "../ui/ConfirmModal"
import SuspendUserModal from "../ui/SuspendPopup"
import { handleSuspendAdmin, handleBanAdmin, handleActivateAdmin } from "@/src/hooks/admins/AdminActions"
import { useToast } from "@/src/lib/ToastProvider"

interface AdminProfileSidebarProps {
    showSidebar: boolean
    onClose: () => void
    admin: Admin
    currentStatus: string
    setData: React.Dispatch<React.SetStateAction<Admin[]>>
    onStatusUpdate: (adminId: string, newStatus: string) => void
}

const roles = [
    { id: "super admin", title: "Super Admin" },
    { id: "support agent", title: "Support Agent" },
    { id: "financial manager", title: "Financial Manager" },
]

export default function AdminSidebar({
    showSidebar,
    onClose,
    admin,
    currentStatus,
    setData,
    onStatusUpdate
}: AdminProfileSidebarProps) {
    const { showSuccess, showError } = useToast();
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedRole, setSelectedRole] = useState(admin.role)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldSlideIn, setShouldSlideIn] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [actionType, setActionType] = useState("")

    // Local state to track current admin status
    const [localCurrentStatus, setLocalCurrentStatus] = useState(currentStatus)

    // Confirmation modal states
    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [showBanModal, setShowBanModal] = useState(false)
    const [showActivateModal, setShowActivateModal] = useState(false)

    // Update local status when currentStatus prop changes
    useEffect(() => {
        setLocalCurrentStatus(currentStatus)
    }, [currentStatus])

    // Handle animation and visibility states
    useEffect(() => {
        if (showSidebar) {
            setIsVisible(true)
            setTimeout(() => {
                setShouldSlideIn(true)
            }, 0)
            document.body.style.overflow = "hidden"
        } else {
            setShouldSlideIn(false)
            const timer = setTimeout(() => {
                setIsVisible(false)
                document.body.style.overflow = "auto"
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [showSidebar])

    // Clean up overflow style when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    const handleSelect = (role: string) => {
        setSelectedRole(role);
        setShowDropdown(false);
    };

    const handleAssignRole = async () => {
        setIsEditing(false)
        setShowDropdown(false)
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/updateRole`, {
                role: selectedRole,
                id: admin._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            console.log("Assigned role:", selectedRole)
            if (res.data.success) {
                showSuccess("Success", "Admin role updated successfully");
            } else {
                showError("Update Failed", "Failed to update admin role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            showError("Error", "An error occurred while updating the admin role");
        }
    }

    // Handle suspend admin confirmation
    const handleSuspendConfirmation = () => {
        setShowSuspendModal(true)
    }

    // Handle ban admin confirmation
    const handleBanConfirmation = () => {
        setShowBanModal(true)
    }

    // Handle activate admin confirmation
    const handleActivateConfirmation = () => {
        setShowActivateModal(true)
    }

    // Execute suspend admin
    const executeSuspendAdmin = async (days: number = 7) => {
        setIsSubmitting(true)
        setActionType("suspend")
        try {
            await handleSuspendAdmin({
                id: admin._id,
                setIsSubmitting,
                showSuccess,
                showError,
                setSuccess,
                days
            });
            
            // Update both local state and parent state
            setLocalCurrentStatus("Suspended")
            setData((prevAdmins) =>
                prevAdmins.map((prevAdmin) =>
                    prevAdmin._id === admin._id
                        ? { ...prevAdmin, userStatus: "Suspended" }
                        : prevAdmin
                )
            );
            // Notify table about status change
            onStatusUpdate(admin._id, "Suspended")
        } catch (error) {
            console.error("Error suspending admin:", error)
        } finally {
            setIsSubmitting(false)
            setActionType("")
            setShowSuspendModal(false)
            setSuccess(false)
        }
    }

    // Execute ban admin
    const executeBanAdmin = async () => {
        setIsSubmitting(true)
        setActionType("ban")
        try {
            await handleBanAdmin({
                id: admin._id,
                setIsSubmitting,
                showSuccess,
                showError,
                setSuccess
            });
            
            // Update both local state and parent state
            setLocalCurrentStatus("Banned")
            setData((prevAdmins) =>
                prevAdmins.map((prevAdmin) =>
                    prevAdmin._id === admin._id
                        ? { ...prevAdmin, userStatus: "Banned" }
                        : prevAdmin
                )
            );
            // Notify table about status change
            onStatusUpdate(admin._id, "Banned")
        } catch (error) {
            console.error("Error banning admin:", error)
        } finally {
            setIsSubmitting(false)
            setActionType("")
            setShowBanModal(false)
            setSuccess(false)
        }
    }

    // Execute activate admin
    const executeActivateAdmin = async () => {
        setIsSubmitting(true)
        setActionType("activate")
        try {
            await handleActivateAdmin({
                id: admin._id,
                setIsSubmitting,
                showSuccess,
                showError,
                setSuccess
            });
            
            // Update both local state and parent state
            setLocalCurrentStatus("Active")
            setData((prevAdmins) =>
                prevAdmins.map((prevAdmin) =>
                    prevAdmin._id === admin._id
                        ? { ...prevAdmin, userStatus: "Active" }
                        : prevAdmin
                )
            );
            // Notify table about status change
            onStatusUpdate(admin._id, "Active")
        } catch (error) {
            console.error("Error activating admin:", error)
        } finally {
            setIsSubmitting(false)
            setActionType("")
            setShowActivateModal(false)
            setSuccess(false)
        }
    }

    if (!isVisible && !showSidebar) return null

    return (
        <>
            <div className="fixed inset-0 z-40 overflow-hidden">
                {/* Overlay with fade animation */}
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Sidebar with slide animation */}
                <div
                    className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${shouldSlideIn ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex h-full flex-col overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 mt-5">
                            <h2 className="text-2xl font-semibold">Admin Profile</h2>
                            <button onClick={onClose} className="rounded-full cursor-pointer p-1 hover:bg-gray-100" aria-label="Close sidebar">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                            {/* Profile Image */}
                            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                                <img
                                    src={admin.image || "/images/blank-profile.webp"}
                                    alt={admin.name}
                                    width={128}
                                    height={128}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <h3 className="mb-1 text-xl font-semibold">{admin.name}</h3>
                            <p className="mb-6 text-sm text-gray-500">User ID: {admin.id}</p>

                            <div className="flex flex-col justify-center mb-6" >
                                <div className="mb-2 flex w-full items-center">
                                    <div className="flex w-full gap-5">
                                        <div className="flex gap-2 w-24">
                                            <Image src="/icons/sms.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                            <span className="font-bold">Email</span>
                                        </div>
                                        <span>{admin.email}</span>
                                    </div>
                                </div>

                                <div className="mb-2 flex w-full items-center">
                                    <div className="flex w-full gap-5">
                                        <div className="flex gap-2 w-24">
                                            <Image src="/icons/calendar.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                            <span className="font-bold">Joining</span>
                                        </div>
                                        <span className="text-sm">{formatJoiningDate(admin.date)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex flex-col justify-center px-5" >
                                {/* Current Role */}
                                <div className="mb-4 flex w-full items-center justify-between">
                                    <h4 className="text-xl font-semibold">Current Role</h4>
                                    {!isEditing ? (
                                        <button className="cursor-pointer hover:scale-105" onClick={() => setIsEditing(true)} >
                                            <Image src={"/icons/edit-black.svg"} alt={"user avatar"} width={24} height={24} className="object-cover" />
                                        </button>) :
                                        (<button
                                            onClick={handleAssignRole}
                                            className={`px-4 py-2 border text-sm text-primary border-primary hover:bg-blue-50 rounded-md font-medium cursor-pointer`} >
                                            Save
                                        </button>)}
                                </div>

                                <div className={`relative w-full border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left rounded-md group ${showDropdown ? "mb-50" : "mb-16"} `} >
                                    <span className="font-light px-4">{roles.find((role) => role.id === selectedRole)?.title || "Select Role"}</span>
                                    <button onClick={() => setShowDropdown(prev => !prev)} >
                                        <ChevronDown className={`h-5 w-5 text-gray-400 group-hover:text-gray-600 cursor-pointer ${isEditing ? showDropdown ? "hidden" : "" : "hidden"}`} />
                                        <ChevronUp className={`h-5 w-5 text-gray-400 group-hover:text-gray-600 cursor-pointer ${isEditing ? showDropdown ? "" : "hidden" : "hidden"}`} />
                                    </button>

                                    {showDropdown && (
                                        <ul className="absolute top-12 z-10 mt-1 w-full pb-10">
                                            {roles.map((role) => (
                                                <li
                                                    key={role.id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelect(role.id)}
                                                >
                                                    {role.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons - Use localCurrentStatus for immediate UI updates */}
                            {localCurrentStatus === "Active" ? (
                                <div className="flex justify-between mt-auto w-full gap-4 px-5">
                                    <button 
                                        className="rounded-md border px-6 py-2 border-[#DF1D1D] text-[#DF1D1D] hover:bg-red-50 cursor-pointer font-bold disabled:opacity-50"
                                        onClick={handleSuspendConfirmation}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && actionType === "suspend" ? "Suspending..." : "Suspend"}
                                    </button>
                                    <button 
                                        className="rounded-md px-6 py-2 bg-[#DF1D1D] text-white hover:bg-red-700 cursor-pointer font-bold disabled:opacity-50"
                                        onClick={handleBanConfirmation}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && actionType === "ban" ? "Banning..." : "Ban"}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full px-5">
                                    <button 
                                        className="w-full rounded-md px-6 py-2 bg-primary text-white hover:bg-blue-700 cursor-pointer font-bold disabled:opacity-50"
                                        onClick={handleActivateConfirmation}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && actionType === "activate" ? "Activating..." : "Activate Admin"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modals */}
            <ConfirmModal
                isOpen={showActivateModal}
                onClose={() => !isSubmitting && setShowActivateModal(false)}
                onConfirm={executeActivateAdmin}
                title="Activate Admin"
                message="Are you sure you want to activate this admin? They will regain access to their admin account."
                warningText="This action will restore the admin's account access."
                cancelText="Cancel"
                confirmText="Activate Admin"
                isLoading={isSubmitting}
                style="blue"
            />

            {/* Replace ConfirmModal with SuspendUserModal for suspend actions */}
            <SuspendUserModal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                userName={admin?.name || "N/A"}
                onConfirm={(days) => executeSuspendAdmin(days)}
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={showBanModal}
                onClose={() => !isSubmitting && setShowBanModal(false)}
                onConfirm={executeBanAdmin}
                title="Ban Admin"
                message="Are you sure you want to ban this admin? They will lose access to their admin account permanently."
                warningText="This action is permanent and cannot be undone."
                cancelText="Cancel"
                confirmText="Ban Admin"
                isLoading={isSubmitting}
                style="red"
            />
        </>
    )
}