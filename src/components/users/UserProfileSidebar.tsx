"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { User } from "@/src/Types/User";
import VerificationAccordion from "../cards/VerficationAccordion";
import ConfirmModal from "../ui/ConfirmModal";
import ErrorPopup from "../ui/ErrorPopup";
import handleBanUser from "@/src/hooks/users/banUser";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleActivateUser from "@/src/hooks/users/activateUser";
import { useToast } from "@/src/lib/ToastProvider";
import SuspendUserModal from "../ui/SuspendPopup";
import useFetchKycUser from "@/src/hooks/users/getKycUser";
import { isCompleteKycUser, isNewKycUser } from "@/src/Types/KycUser";
import UserSidebarSkeleton from "./SidebarSkeleton";
import { isUserActive } from "@/src/lib/functions";

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
  const { showSuccess, showError } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSlideIn, setShouldSlideIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");
  const { user: kycUser, isLoading: isKycLoading, isError } = useFetchKycUser(user._id);

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
      await handleActivateUser({
        id: user._id,
        setIsSubmitting,
        showSuccess,
        showError,
      });

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
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowActivateModal(false);
      setSuccess(false);
    }
  };

  // Execute suspend user
  const executeSuspendUser = async (days: number) => {
    setIsSubmitting(true);
    setActionType("suspend");
    try {
      await handleSuspendUser({
        id: user._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
        days,
      });

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
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowSuspendModal(false);
      setSuccess(false);
    }
  };

  // Execute ban user
  const executeBanUser = async () => {
    setIsSubmitting(true);
    setActionType("ban");
    try {
      await handleBanUser({
        id: user._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

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
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowBanModal(false);
      setSuccess(false);
    }
  };

  // Handle animation and visibility states
  useEffect(() => {
    if (showSidebar) {
      setIsVisible(true);
      setTimeout(() => {
        setShouldSlideIn(true);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      setShouldSlideIn(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "auto";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showSidebar]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!isVisible && !showSidebar) return null;

  // Show skeleton while KYC data is loading
  if (isKycLoading) {
    return (
      <UserSidebarSkeleton
        showSidebar={showSidebar}
        onClose={onClose}
        shouldSlideIn={shouldSlideIn}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            shouldSlideIn ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            shouldSlideIn ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className={"flex h-full flex-col overflow-y-auto"}>
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
            
            <div className="flex flex-col items-center px-6 py-8 font-[satoshi] w-full">
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
                {user.name
                  ? user.name.firstName + " " + user.name.lastName
                  : "N/A"}
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
                <div
                  className={`mb-4 flex w-full items-center justify-between gap-10 ${
                    user.verificationStatus !== "approved" ? "mb-10" : ""
                  }`}
                >
                  <h4 className="text-2xl font-semibold text-center">
                    KYC Verification
                  </h4>
                  {kycUser?.status === "approved" ? (
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
                {kycUser && isCompleteKycUser(kycUser) && kycUser.status === "approved" && (
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
                {kycUser && isCompleteKycUser(kycUser) && kycUser.status === "requested" && (
                  <div className="w-full pb-8">
                    <VerificationAccordion kycUser={kycUser} />
                  </div>
                )}
                {kycUser && isNewKycUser(kycUser) && (
                  <div className="w-full pb-8">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <h5 className="text-lg font-semibold text-gray-800 mb-2">
                        KYC Not Applied
                      </h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        This user has not applied for KYC verification yet. They will need to complete the KYC process to verify their identity.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Use currentUserStatus for immediate UI updates */}
              {isUserActive(currentUserStatus)  ? (
                <div className="z-5 flex justify-between mt-auto w-full gap-4 px-5">
                  <button
                    className="rounded-md border px-6 py-2 border-[#DF1D1D] text-[#DF1D1D] hover:bg-red-50 cursor-pointer font-bold disabled:opacity-50"
                    onClick={handleSuspendConfirmation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && actionType === "suspend"
                      ? "Suspending..."
                      : "Suspend"}
                  </button>
                  <button
                    className="rounded-md px-6 py-2 bg-[#DF1D1D] text-white hover:bg-red-700 cursor-pointer font-bold disabled:opacity-50"
                    onClick={handleBanConfirmation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && actionType === "ban"
                      ? "Banning..."
                      : "Ban"}
                  </button>
                </div>
              ) : (
                <div className="z-5 w-full px-5">
                  <button
                    className="w-full rounded-md px-6 py-2 bg-primary text-white hover:scale-105 cursor-pointer font-bold disabled:opacity-50"
                    onClick={handleActivateConfirmation}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && actionType === "activate"
                      ? "Activating..."
                      : "Activate User"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        userName={
          user.name ? user.name.firstName + " " + user.name.lastName : "N/A"
        }
        onConfirm={(days: number) => {
          executeSuspendUser(days);
        }}
        isLoading={isSubmitting}
      />

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
