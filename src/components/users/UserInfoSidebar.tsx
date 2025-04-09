"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, Mail, Calendar } from "lucide-react"

interface UserProfileSidebarProps {
    showSidebar: boolean
    onClose: () => void
    user?: {
        id: string
        name: string
        email: string
        joiningDate: string
        isVerified: boolean
        profileImage?: string
    }
}

export default function UserProfileSidebar({
    showSidebar,
    onClose,
    user = {
        id: "CP-001",
        name: "John Doe",
        email: "johndoe@gmail.com",
        joiningDate: "12-03-20",
        isVerified: true,
        profileImage: "/images/user-avatar.png",
    },
}: UserProfileSidebarProps) {
    // Prevent body scrolling when sidebar is open
    useEffect(() => {
        if (showSidebar) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [showSidebar])

    if (!showSidebar) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} aria-hidden="true" />

            {/* Sidebar */}
            <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
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
                                src={user.profileImage || "/placeholder.svg?height=200&width=200"}
                                alt={user.name}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* User Info */}
                        <h3 className="mb-1 text-xl font-semibold">{user.name}</h3>
                        <p className="mb-6 text-sm text-gray-500">User ID: {user.id}</p>

                        <div className="flex flex-col justify-center mb-6" >
                            <div className="mb-2 flex w-full items-center">
                                <div className="flex w-full gap-5">
                                    <div className="flex gap-2 w-24">
                                        <Image src="/icons/sms.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                        <span className="font-bold">Email</span>
                                    </div>
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <div className="mb-2 flex w-full items-center">
                                <div className="flex w-full gap-5">
                                    <div className="flex gap-2 w-24">
                                    <Image src="/icons/calendar.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                        <span className="font-bold">Joining</span>
                                    </div>
                                    <span className="text-sm">{user.joiningDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center" >
                            {/* KYC Verification */}
                        <div className="mb-4 flex w-full items-center justify-between gap-10">
                            <h4 className="text-2xl font-semibold">KYC Verification</h4>
                            {user.isVerified && (
                                <span className="rounded-xl font-bold px-4 py-2 text bg-[#71FB5533] text-[#20C000]">Verified</span>
                            )}
                        </div>

                        {/* Verification Badge */}
                        <div className="mb-12 flex justify-center">
                            <div className="relative">
                                <Image
                                    src="/icons/blue-clock.svg"
                                    alt="Verification Badge"
                                    width={220}
                                    height={220}
                                    className="w-full h-full"
                                />

                                <Image
                                    src="/icons/ellipse-shadow.svg"
                                    alt="Verification Badge"
                                    width={162}
                                    height={12}
                                    className="absolute top-27 w-full h-full"
                                />
                            </div>
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
