"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import VerificationAccordion from "../cards/VerificationForm"

interface SidebarProps {
    showSidebar: boolean
    onClose: () => void
    order: {
        userName: string;
        userEmail: string;
        userJoiningDate: string;
        orderID: string;
        userID: string;
        cardType: string;
        date: string;
        deliveryAddress: string;
        orderStatus: string;
        cardStatus: string;
    }
}

export default function OrderDetailsSidebar({
    showSidebar,
    onClose,
    order,
}: SidebarProps) {
    const [steps, setSteps] = useState([
        { title: "Personal Details", completed: true },
        { title: "Documents", completed: false },
        { title: "Selfie", completed: false },
    ])
    const [verificationStarted, setVerificationStarted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [shouldSlideIn, setShouldSlideIn] = useState(false)

    const handleStartVerification = () => {
        console.log("Starting verification process")
        setVerificationStarted(true)
    }

    const handleVerfiyUser = () => {
        console.log("Verifying user")
    }

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

    if (!isVisible && !showSidebar) return null

    if (verificationStarted) {
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
                    <div className="flex flex-col h-full justify-between pb-5">
                        <div className="flex h-full flex-col overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 mt-5">
                                <div></div>
                                <button onClick={() => {
                                    onClose();
                                    setVerificationStarted(false);
                                }} className="rounded-full cursor-pointer p-1 hover:bg-gray-100" aria-label="Close sidebar">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                                <div className="mb-4 flex w-full items-center justify-between gap-10 px-5">
                                    <h4 className="text-2xl font-semibold">KYC Verification</h4>
                                    <span className="rounded-xl font-bold px-4 py-2 text-[#727272] bg-[#72727233]">Pending</span>
                                </div>
                                <VerificationAccordion />
                            </div>
                        </div>
                        <div className="px-16">
                            <button
                                onClick={handleVerfiyUser}
                                className="w-full bg-primary hover:bg-blue-900 cursor-pointer text-white font-medium py-2 px-6 rounded-md transition-colors"
                            >
                                Verify User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

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
                                src={"/images/user-avatar.png"}
                                alt={"user image"}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* User Info */}
                        <h3 className="mb-1 text-xl font-semibold">{order.userName}</h3>
                        <p className="mb-6 text-sm text-gray-500">User ID: {order.userID}</p>

                        <div className="flex flex-col justify-center mb-6" >
                            <div className="mb-2 flex w-full items-center">
                                <div className="flex w-full gap-5">
                                    <div className="flex gap-2 w-24">
                                        <Image src="/icons/sms.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                        <span className="font-bold">Email</span>
                                    </div>
                                    <span>{order.userEmail}</span>
                                </div>
                            </div>

                            <div className="mb-2 flex w-full items-center">
                                <div className="flex w-full gap-5">
                                    <div className="flex gap-2 w-24">
                                        <Image src="/icons/calendar.svg" alt="User Icon" width={25} height={25} className="h-5 w-5 text-gray-400" />
                                        <span className="font-bold">Joining</span>
                                    </div>
                                    <span className="text-sm">{order.userJoiningDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center" >
                            <div className="mb-4 flex w-full items-center justify-between gap-10">
                                <h4 className="text-2xl font-semibold">{order.cardType === "Virtual" ? "Virtual Card" : "Physical Card"}</h4>
                                {order.cardStatus === "Active" && (
                                    <span className="rounded-xl font-bold px-4 py-2 text bg-[#71FB5533] text-[#20C000]">Verified</span>
                                )}
                                {order.cardStatus === "Inactive" && (
                                    <span className="rounded-xl font-bold px-4 py-2 text-[#727272] bg-[#72727233]">Pending</span>
                                )}
                            </div>
                            <div className="mb-4 flex w-full items-center justify-between gap-10">
                                <p className="font-semibold text-sm">Payment Method</p>
                                <p className="text-sm text-gray-800">{"Cashpay Wallet"}</p>
                            </div>
                            <div className="mb-4 flex w-full items-center justify-between gap-10">
                                <p className="font-semibold text-sm">Request Date</p>
                                <p className="text-sm text-gray-800">{order.date}</p>
                            </div>
                            {order.orderStatus != "Dispatched" && <div className="mb-4 flex w-full items-center justify-between gap-10">
                                <p className="font-semibold text-sm">Delivery Address</p>
                                <p className="text-sm text-gray-800">{order.deliveryAddress}</p>
                            </div>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between mt-10 w-full gap-4 px-5">
                            <button className="w-full rounded-lg px-6 py-2 bg-primary text-white hover:bg-blue-900 cursor-pointer font-semibold">{order.cardType === "Inactive" ? "Activate Card" : "Dispatch Card"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}