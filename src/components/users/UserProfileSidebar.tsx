"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { User } from "@/src/Types/User";
import VerificationAccordion from "../cards/VerficationStatus";
import VerificationSteps from "../cards/VerificationForm";
import ConfirmModal from "../ui/ConfirmModal";
import ErrorPopup from "../ui/ErrorPopup";
import handleBanUser from "@/src/hooks/users/banUser";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleActivateUser from "@/src/hooks/users/activateUser";

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
    // Renamed variables to match UserInfoSidebar
    const [isVisible, setIsVisible] = useState(false);
    const [shouldSlideIn, setShouldSlideIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [actionType, setActionType] = useState("");
    const [verificationStarted, setVerificationStarted] = useState(false);
    const [steps, setSteps] = useState([
        { title: "Personal Details", completed: user.KycProfileAdded },
        { title: "Documents", completed: user.KycIdDocAdded },
        { title: "Selfie", completed: user.KycSellfieAdded },
    ]);
    const [isVerifying, setIsVerifying] = useState(false);

    // Error popup state
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Local state to track current user status for immediate UI updates
    const [currentUserStatus, setCurrentUserStatus] = useState(user.userStatus);

    // Confirmation modal states
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);

    // Update local status when user prop changes
    useEffect(() => {
        setCurrentUserStatus(user.userStatus);
    }, [user.userStatus]);

    const handleStartVerification = () => {
        console.log("Starting verification process");
        setVerificationStarted(true);
    };

    const handleVerifyUser = async () => {
        setIsVerifying(true);

        try {
            const response = await axios.put(
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

            // Check if the response indicates success
            if (response.data.success !== false) {
                setIsVerifying(false);
                setData((prevUsers) =>
                    prevUsers.map((prevUser) =>
                        prevUser._id === user._id
                            ? { ...prevUser, verificationStatus: "Approved" }
                            : prevUser
                    )
                );
                alert("User verification status updated successfully.");
                onClose();
                setVerificationStarted(false);
            } else {
                // Handle case where success is false but no error thrown
                throw new Error(response.data.error || "Failed to update verification status");
            }
        } catch (error: any) {
            console.error("Error updating user verification status:", error);
            
            // Extract error message from different possible sources
            let errorMsg = "An unexpected error occurred while updating verification status.";
            
            if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            // Show error popup instead of alert
            setErrorMessage(errorMsg);
            setShowErrorPopup(true);
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle activate user confirmation
    const handleActivateConfirmation = () => {
        setShowActivateModal(true);
    };

    // Handle suspend user confirmation
    const handleSuspendConfirmation = () => {
        setShowSuspendModal(true);
    };

    // Handle ban user confirmation
    const handleBanConfirmation = () => {
        setShowBanModal(true);
    };

    // Execute activate user
    const executeActivateUser = async () => {
        setIsSubmitting(true);
        setActionType("activate");
        try {
            await handleActivateUser(user._id);
            alert("User activated successfully.");
            
            // Update both local state and parent state immediately
            setCurrentUserStatus("Active");
            setData((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser._id === user._id
                        ? { ...prevUser, userStatus: "Active" }
                        : prevUser
                )
            );
        } catch (error) {
            console.error("Error activating user:", error);
            alert("Failed to activate user. Please try again later.");
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowActivateModal(false);
        }
    };

    // Execute suspend user
    const executeSuspendUser = async () => {
        setIsSubmitting(true);
        setActionType("suspend");
        try {
            await handleSuspendUser(user._id);
            alert("User suspended successfully.");
            
            // Update both local state and parent state immediately
            setCurrentUserStatus("Suspended");
            setData((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser._id === user._id
                        ? { ...prevUser, userStatus: "Suspended" }
                        : prevUser
                )
            );
        } catch (error) {
            console.error("Error suspending user:", error);
            alert("Failed to suspend user. Please try again later.");
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowSuspendModal(false);
        }
    };

    // Execute ban user
    const executeBanUser = async () => {
        setIsSubmitting(true);
        setActionType("ban");
        try {
            await handleBanUser(user._id);
            alert("User banned successfully.");
            
            // Update both local state and parent state immediately
            setCurrentUserStatus("Banned");
            setData((prevUsers) =>
                prevUsers.map((prevUser) =>
                    prevUser._id === user._id
                        ? { ...prevUser, userStatus: "Banned" }
                        : prevUser
                )
            );
        } catch (error) {
            console.error("Error banning user:", error);
            alert("Failed to ban user. Please try again later.");
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowBanModal(false);
        }
    };

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

    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    if (!isVisible && !showSidebar) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-hidden">
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`}
                    onClick={onClose}
                    aria-hidden="true"
                />
                
                <div
                    className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${shouldSlideIn ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    {verificationStarted ? (
                        // Verification flow content...
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
                            <div className="mt-auto px-16 pb-5">
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
                        // Regular sidebar content...
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
                            {/* Rest of your existing sidebar content... */}
                            <div className="flex flex-col items-center px-6 py-8 font-[satoshi]">
                                {/* Profile Image */}
                                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full">
                                    <img
                                        src={user.selfieUrl || "/images/blank-profile.webp"}
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

                                {/* Action Buttons - Use currentUserStatus for immediate UI updates */}
                                {currentUserStatus === "Active" ? (
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
                                            className="w-full rounded-md px-6 py-2 bg-primary text-white hover:scale-105 cursor-pointer font-bold disabled:opacity-50"
                                            onClick={handleActivateConfirmation}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && actionType === "activate" ? "Activating..." : "Activate User"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Popup */}
            <ErrorPopup
                isOpen={showErrorPopup}
                onClose={() => setShowErrorPopup(false)}
                title="KYC Update Failed"
                message={errorMessage}
                autoClose={false}
            />

            {/* Confirmation Modals */}
            <ConfirmModal
                isOpen={showActivateModal}
                onClose={() => !isSubmitting && setShowActivateModal(false)}
                onConfirm={executeActivateUser}
                title="Activate User"
                message="Are you sure you want to activate this user? They will regain access to their account."
                warningText="This action will restore the user's account access."
                cancelText="Cancel"
                confirmText="Activate User"
                isLoading={isSubmitting}
                style="blue"
            />

            <ConfirmModal
                isOpen={showSuspendModal}
                onClose={() => !isSubmitting && setShowSuspendModal(false)}
                onConfirm={executeSuspendUser}
                title="Suspend User"
                message="Are you sure you want to suspend this user? They will lose access to their account temporarily."
                warningText="This action can be reversed later."
                cancelText="Cancel"
                confirmText="Suspend User"
                isLoading={isSubmitting}
                style="red"
            />

            <ConfirmModal
                isOpen={showBanModal}
                onClose={() => !isSubmitting && setShowBanModal(false)}
                onConfirm={executeBanUser}
                title="Ban User"
                message="Are you sure you want to ban this user? They will lose access to their account permanently."
                warningText="This action is permanent and cannot be undone."
                cancelText="Cancel"
                confirmText="Ban User"
                isLoading={isSubmitting}
                style="red"
            />
        </>
    );
}