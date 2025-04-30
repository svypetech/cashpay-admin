"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, X } from "lucide-react"

interface AdminProfileSidebarProps {
    showSidebar: boolean
    onClose: () => void
    admin?: {
        id: string
        name: string
        email: string
        joiningDate: string
        role?: string
        status?: string
        profileImage?: string
    }
}

const roles = ["Super Admin", "Support Agent", "Financial Manager"];

export default function AdminSidebar({
    showSidebar,
    onClose,
    admin = {
        id: "CP-001",
        name: "John Doe",
        email: "johndoe@gmail.com",
        joiningDate: "12-03-20",
        status: "+93 2328238902",
        profileImage: "/images/user-avatar.png",
    },
}: AdminProfileSidebarProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedRole, setSelectedRole] = useState(admin.role)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldSlideIn, setShouldSlideIn] = useState(false)

    // Handle animation and visibility states
    useEffect(() => {
        if (showSidebar) {
            setIsVisible(true) // Render the sidebar
            // Use a small timeout to ensure DOM is ready before starting animation
            setTimeout(() => {
                setShouldSlideIn(true) // Trigger slide-in animation
            }, 0)
            document.body.style.overflow = "hidden" // Prevent scrolling
        } else {
            setShouldSlideIn(false) // Start slide-out animation
            // Wait for animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setIsVisible(false)
                document.body.style.overflow = "auto" // Re-enable scrolling
            }, 300) // Match transition duration
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

    if (!isVisible && !showSidebar) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
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
                        <h2 className="text-2xl font-semibold">User Profile</h2>
                        <button onClick={onClose} className="rounded-full cursor-pointer p-1 hover:bg-gray-100" aria-label="Close sidebar">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                        {/* Profile Image */}
                        <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                            <Image
                                src={admin.profileImage || "/placeholder.svg?height=200&width=200"}
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
                                    <span className="text-sm">{admin.joiningDate}</span>
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
                                    (<button className={`px-4 py-2 border text-sm text-primary border-primary hover:bg-blue-50 rounded-md font-medium cursor-pointer`} onClick={() => setIsEditing(false)} >
                                        Save
                                    </button>)}
                            </div>

                            <div className={`relative w-full border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left rounded-md group ${showDropdown ? "mb-50" : "mb-16"} `} >
                                <span className="font-light px-4">{selectedRole}</span>
                                <button onClick={() => setShowDropdown(prev => !prev)} >
                                    <ChevronDown className={`h-5 w-5 text-gray-400 group-hover:text-gray-600 cursor-pointer ${isEditing ? showDropdown ? "hidden" : "" : "hidden"}`} />
                                    <ChevronUp className={`h-5 w-5 text-gray-400 group-hover:text-gray-600 cursor-pointer ${isEditing ? showDropdown ? "" : "hidden" : "hidden"}`} />
                                </button>

                                {showDropdown && (
                                    <ul className="absolute top-12 z-10 mt-1 w-full pb-10">
                                        {roles.map((role) => (
                                            <li
                                                key={role}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSelect(role)}
                                            >
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-auto w-full gap-4 px-5">
                            <button className="rounded-md border px-6 py-2 border-[#DF1D1D] text-[#DF1D1D] hover:bg-red-50 cursor-pointer font-bold">
                                Suspend
                            </button>
                            <button className="rounded-md px-6 py-2 bg-[#DF1D1D] text-white hover:bg-red-700 cursor-pointer font-bold">Ban</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}