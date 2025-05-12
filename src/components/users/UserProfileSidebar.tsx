"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { User } from "@/src/Types/User";
import VerificationAccordion from "../cards/VerficationStatus";
import VerificationSteps from "../cards/VerificationForm";
import handleBanUser from "@/src/hooks/users/banUser";
import handleSuspendUser from "@/src/hooks/users/suspendUser";


interface UserProfileSidebarProps {
    showSidebar: boolean;
    onClose: () => void;
    user: User;
    setData: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserProfileSidebar({
    showSidebar,
    onClose,
    user,
    setData,
}: UserProfileSidebarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [slideIn, setSlideIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [actionType, setActionType] = useState("");
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [steps, setSteps] = useState([
        { title: "Personal Details", completed: user.KycProfileAdded },
        { title: "Documents", completed: user.KycIdDocAdded },
        { title: "Selfie", completed: user.KycSellfieAdded },
    ]);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleStartVerification = () => {
        console.log("Starting verification process");
        setVerificationStarted(true);
    };

    const handleVerifyUser = async () => {
        setIsVerifying(true);

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/updateKycStatus`,
                {
                    status: "Approved",
                    id: user._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setIsVerifying(false);
            setData((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser._id === user._id
                        ? { ...prevUser, verificationStatus: "Approved" }
                        : prevUser
                )
            );
            alert("User verification status updated successfully.");
        } catch (error) {
            alert("Error updating user verification status.");
            console.error("Error updating user verification status:", error);
        } finally {
            onClose();
            setVerificationStarted(false);
        }
    };

    // Prevent body scrolling when sidebar is open
    useEffect(() => {
        if (showSidebar) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showSidebar]);

    useEffect(() => {
        if (showSidebar) {
            setIsVisible(true);
            setTimeout(() => {
                setSlideIn(true);
            }, 10);
        } else {
            setSlideIn(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showSidebar]);

    if (!showSidebar && !isVisible) return null;

    return (
        <div className="fixed inset-0 z-100 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${slideIn ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${slideIn ? "translate-x-0" : "translate-x-full"
                    }`}
            >

                {verificationStarted ? (
                    <div className="flex flex-col h-full justify-between pb-5">
                        <div className="flex h-full flex-col overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-4 mt-5">
                                <div></div>
                                <button
                                    onClick={() => {
                                        onClose();
                                        setVerificationStarted(false);
                                    }}
                                    className="rounded-full cursor-pointer p-1 hover:bg-gray-100"
                                    aria-label="Close sidebar"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                                <div className="mb-4 flex w-full items-center justify-between gap-10 px-5">
                                    <h4 className="text-2xl font-semibold text-center">
                                        KYC Verification
                                    </h4>
                                    <span className="rounded-xl font-bold px-4 py-2 text-[#727272] bg-[#72727233]">
                                        Pending
                                    </span>
                                </div>
                                <VerificationAccordion
                                    personalDetails={{
                                        name: user.name ? user.name.firstName + " " + user.name.lastName : "N/A",
                                        dob: user.DOB,
                                        region: user.region,
                                    }}
                                    document={{
                                        url: user.idDocUrl,
                                        fileName:
                                            user.name ? user.name.firstName +
                                                " " +
                                                user.name.lastName : "N/A" +
                                            " ID.png",
                                    }}
                                    selfieDocument={{
                                        url: user.selfieUrl,
                                        fileName:
                                            user.name ? user.name.firstName +
                                                " " +
                                                user.name.lastName : "N/A" +
                                            " selfie.png",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="px-16">
                            <button
                                onClick={handleVerifyUser}
                                disabled={isVerifying}
                                className="flex w-full justify-center cursor-pointer rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-70"
                            >
                                {isVerifying ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin">
                                        Please Wait...
                                    </Loader2>
                                ) : (
                                    "Verify User"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 mt-5">
                            <h2 className="text-2xl font-semibold">User Profile</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full cursor-pointer p-1 hover:bg-gray-100"
                                aria-label="Close sidebar"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {/* Content */}
                        <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                            {/* Profile Image */}
                            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                                <img
                                    src={user.selfieUrl || "/placeholder.svg?height=200&width=200"}
                                    alt={"user avatar"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {/* User Info */}
                            <h3 className="mb-1 text-xl font-semibold">
                                {user.name ? (user.name.firstName + " " + user.name.lastName) : "N/A"}
                            </h3>
                            <p className="mb-6 text-sm text-gray-500">User ID: {user._id}</p>
                            <div className="flex flex-col justify-center mb-6">
                                <div className="mb-2 flex w-full items-center">
                                    <div className="flex w-full gap-5">
                                        <div className="flex gap-2 w-24">
                                            <Image
                                                src="/icons/sms.svg"
                                                alt="User Icon"
                                                width={25}
                                                height={25}
                                                className="h-5 w-5 text-gray-400"
                                            />
                                            <span className="font-bold">Email</span>
                                        </div>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                                <div className="mb-2 flex w-full items-center">
                                    <div className="flex w-full gap-5">
                                        <div className="flex gap-2 w-24">
                                            <Image
                                                src="/icons/calendar.svg"
                                                alt="User Icon"
                                                width={25}
                                                height={25}
                                                className="h-5 w-5 text-gray-400"
                                            />
                                            <span className="font-bold">Joining</span>
                                        </div>
                                        <span className="text-sm">{user.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                {/* KYC Verification */}
                                <div className={`mb-4 flex w-full items-center justify-between gap-10 ${user.verificationStatus !== "Approved" ? "mb-10" : ""}`}>
                                    <h4 className="text-2xl font-semibold text-center">
                                        KYC Verification
                                    </h4>
                                    {user.verificationStatus === "Approved" ? (
                                        <span className="rounded-xl font-bold px-4 py-2 text bg-[#71FB5533] text-[#20C000]">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="rounded-xl font-bold px-4 py-2 text-[#727272] bg-[#72727233]">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                {/* Verification Badge */}
                                {user.verificationStatus === "Approved" && (
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
                                )}
                                {user.verificationStatus === "Pending" && (
                                    <VerificationSteps
                                        steps={steps}
                                        onStartVerification={handleStartVerification}
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between mt-auto w-full gap-4 px-5">
                                <button className="rounded-md border px-6 py-2 border-[#DF1D1D] text-[#DF1D1D] hover:bg-red-50 cursor-pointer font-bold"
                                    onClick={() => {
                                        setActionType("suspend")
                                        handleSuspendUser(user._id, setIsSubmitting)
                                    }}
                                >
                                    {isSubmitting && actionType === "suspend" ? "Suspending..." : "Suspend"}
                                </button>
                                <button className="rounded-md px-6 py-2 bg-[#DF1D1D] text-white hover:bg-red-700 cursor-pointer font-bold"
                                    onClick={() => {
                                        setActionType("ban")
                                        handleBanUser(user._id, setIsSubmitting)
                                    }}
                                >
                                    {isSubmitting && actionType === "ban" ? "Banning..." : "Ban"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}