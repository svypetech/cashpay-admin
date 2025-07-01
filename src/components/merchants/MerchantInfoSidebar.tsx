"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Tabs from "../ui/Tabs";
import BankAccountsTab from "./BankAccountsTab";
import ConfirmModal from "../ui/ConfirmModal";
import SuspendUserModal from "../ui/SuspendPopup";
import Merchant from "@/src/Types/Merchant";
import { formatJoiningDate } from "@/src/lib/functions";
import useFetchAccounts from "@/src/hooks/merchants/getMerchankBankAccounts";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleBanUser from "@/src/hooks/users/banUser";
import handleActivateUser from "@/src/hooks/users/activateUser";
import axios from "axios";
import { useToast } from "@/src/lib/ToastProvider";

interface MerchantInfoSidebarProps {
  showSidebar: boolean;
  onClose: () => void;
  merchant: Merchant;
  setMerchants: React.Dispatch<React.SetStateAction<Merchant[]>>;
  onStatusUpdate: (merchantId: string, newStatus: string) => void;
}

export default function MerchantInfoSidebar({
  showSidebar,
  onClose,
  merchant,
  setMerchants,
  onStatusUpdate,
}: MerchantInfoSidebarProps) {
  const { showSuccess, showError } = useToast();
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"Overview" | "Bank Accounts">("Overview");
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSlideIn, setShouldSlideIn] = useState(false);
  const { accounts: bankAccounts, isLoading, error } = useFetchAccounts(merchant._id);
  const [accounts, setAccounts] = useState(bankAccounts);
  const [action, setAction] = useState({
    isLoading: false,
    type: "",
  });

  // Local state to track current merchant status
  const [currentMerchantStatus, setCurrentMerchantStatus] = useState(merchant.status || "Active");

  // Confirmation modal states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");

  // Update local status when merchant prop changes
  useEffect(() => {
    setCurrentMerchantStatus(merchant.status || "Active");
  }, [merchant.status]);

  // Reset active tab when sidebar is closed
  const handleClose = () => {
    setActiveTab("Overview");
    onClose();
  };

  useEffect(() => {
    setAccounts(bankAccounts);
  }, [bankAccounts]);

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
      setActiveTab("Overview");
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = "auto"
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [showSidebar]);

  // Clean up overflow style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, []);

  // Handle activate merchant confirmation
  const handleActivateConfirmation = () => {
    setShowActivateModal(true);
  };

  // Handle suspend merchant confirmation
  const handleSuspendConfirmation = () => {
    setShowSuspendModal(true);
  };

  // Handle ban merchant confirmation
  const handleBanConfirmation = () => {
    setShowBanModal(true);
  };

  // Execute activate merchant
  const executeActivateMerchant = async () => {
    setIsSubmitting(true);
    setActionType("activate");
    try {
      await handleActivateUser({
        id: merchant._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

      // Update both local state and parent state immediately
      setCurrentMerchantStatus("Active");
      if (setMerchants) {
        setMerchants((prevMerchants) =>
          prevMerchants.map((prevMerchant) =>
            prevMerchant._id === merchant._id
              ? { ...prevMerchant, status: "Active" }
              : prevMerchant
          )
        );
      }
      
      // Notify table about status change
      onStatusUpdate(merchant._id, "Active");
    } catch (error) {
      console.error("Error activating merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowActivateModal(false);
      setSuccess(false);
    }
  };

  // Execute suspend merchant
  const executeSuspendMerchant = async (days: number) => {
    setIsSubmitting(true);
    setActionType("suspend");
    try {
      await handleSuspendUser({
        id: merchant._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
        days
      });

      // Update both local state and parent state immediately
      setCurrentMerchantStatus("suspend");
      if (setMerchants) {
        setMerchants((prevMerchants) =>
          prevMerchants.map((prevMerchant) =>
            prevMerchant._id === merchant._id
              ? { ...prevMerchant, status: "suspend" }
              : prevMerchant
          )
        );
      }
      
      // Notify table about status change
      onStatusUpdate(merchant._id, "suspend");
    } catch (error) {
      console.error("Error suspending merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowSuspendModal(false);
      setSuccess(false);
    }
  };

  // Execute ban merchant
  const executeBanMerchant = async () => {
    setIsSubmitting(true);
    setActionType("ban");
    try {
      await handleBanUser({
        id: merchant._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

      // Update both local state and parent state immediately
      setCurrentMerchantStatus("banned");
      if (setMerchants) {
        setMerchants((prevMerchants) =>
          prevMerchants.map((prevMerchant) =>
            prevMerchant._id === merchant._id
              ? { ...prevMerchant, status: "banned" }
              : prevMerchant
          )
        );
      }
      
      // Notify table about status change
      onStatusUpdate(merchant._id, "banned");
    } catch (error) {
      console.error("Error banning merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowBanModal(false);
      setSuccess(false);
    }
  };

  const handleVerifyAccount = async (accountId: string) => {
    setAction({ isLoading: true, type: "verify" });
    const data = { cardId: accountId }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/card/verifyCards`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const updatedCard = response.data.card;

        // Update the local state with the new card data
        setAccounts(prevAccounts =>
          prevAccounts.map(account =>
            account.id === accountId ? updatedCard : account
          )
        );
        showSuccess("Success", "Account verified successfully");
      }
      else {
        showError("Failed", "Could not verify account");
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      showError("Error", "An error occurred while verifying the account");
    } finally {
      setAction({ isLoading: false, type: "" });
    }
  };

  const handleDenyVerification = async (accountId: string) => {
    setAction({ isLoading: true, type: "deny" });
    const data = { cardId: accountId }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/card/declineCards`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        showSuccess("Success", "Account denied successfully");
      }
      else {
        showError("Failed", "Could not deny account");
      }
    } catch (error) {
      console.error("Error denying account:", error);
      showError("Error", "An error occurred while denying the account");
    } finally {
      setAction({ isLoading: false, type: "" });
    }
  };

  if (!isVisible && !showSidebar) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-hidden">
        {/* Overlay with fade animation */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Sidebar with slide animation */}
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${shouldSlideIn ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <button
                onClick={handleClose}
                className="rounded-full cursor-pointer p-1 hover:bg-gray-100"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs - Using the Tabs component from UI folder */}
            <div className="flex justify-center">
              <div className="relative">
                <Tabs
                  tabs={["Overview", "Bank Accounts"]}
                  activeTab={activeTab}
                  setActiveTab={(tab) => setActiveTab(tab as "Overview" | "Bank Accounts")}
                  size="small"
                />
                {/* Orange dot indicator for Bank Accounts */}
                {merchant.verified && (
                  <div className="absolute top-[10px] right-[11px] h-1 w-1 rounded-full bg-orange-500"></div>
                )}
              </div>
            </div>

            {/* Content */}
            {activeTab === "Overview" ? (

              <div className="flex flex-col items-center px-6 py-8">
                {/* Profile Image */}
                <div className="mb-6">
                  <div className="h-24 w-24 overflow-hidden rounded-full">
                    <img
                      src={merchant.image || "/images/blank-profile.webp"}
                      alt={"User Avatar"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* User Info */}
                <h3 className="mb-2 text-xl font-bold">
                  {merchant.name.firstName ? `${merchant.name.firstName} ${merchant.name.lastName}` : "N/A"}
                </h3>
                <p className="mb-6 text-[13px] text-[#1D1D1D]">User-ID: {merchant._id}</p>

                <div className="flex items-center justify-center gap-2 mb-4">


                  <div className="w-full max-w-sm space-y-4 mb-8 ">
                    {/* Email */}
                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-2">
                        <Image src="/icons/sms.svg" alt="Email" width={24} height={24} />
                        <p className="font-[700]">Email</p>

                      </div>

                      <p className="text-gray-600">{merchant.email}</p>

                    </div>

                    {/* Joining */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Image src="/icons/calendar.svg" alt="Joining" width={24} height={24} />
                        <p className=" font-[700]">Joining</p>

                      </div>
                      <p className="text-gray-600">{formatJoiningDate(merchant.joinedDate)}</p>

                    </div>
                  </div>
                </div>

                {/* Overview Section */}
                {activeTab === "Overview" && (
                  <div className="w-full">
                    <h4 className="text-xl font-bold mb-6">Overview</h4>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      {/* Active Time */}
                      <div className="rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4">
                        <div className="flex flex-col gap-2 mb-2">
                          <Image src="/icons/merchant clock.svg" alt="Active Time" width={28} height={28} />
                          <p className="text-[16px] font-[400] text-gray">Active Time</p>
                        </div>
                        <p className="text-[24px] text-primary font-[700]">{merchant.activeTime} hours</p>
                      </div>

                      {/* Views */}
                      <div className="rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex flex-col gap-2">
                            <Image src="/icons/merchant eye.svg" alt="Views" width={28} height={28} />
                            <p className="text-[16px] font-[400] text-gray">Views</p>
                          </div>
                          <div className="text-green-500 text-sm font-medium">
                            <span className="flex">
                              {merchant.views ?
                                <Image src="/icons/Arrow up.svg" alt="Increase" width={17} height={17} /> :
                                <Image src="/icons/Arrow down.svg" alt="Decrease" width={17} height={17} />
                              }
                              {Math.abs(merchant.views || 0)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-[24px] text-primary font-[700]">{merchant.views}</p>
                      </div>
                    </div>

                    {/* Success Rate */}
                    <div className="rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Image src="/icons/merchant success.svg" alt="Success Rate" width={28} height={28} />
                          <span className="text-[16px] font-[400] text-gray">Success Rate</span>
                        </div>
                        <div className={`text-sm font-medium flex ${merchant?.successRate < 5 ? "text-red-500" : "text-green-500"}`}>
                          <span className="flex">
                            {merchant.successRate < 5 ?
                              <Image src="/icons/Arrow down.svg" alt="Decrease" width={17} height={17} /> :
                              <Image src="/icons/Arrow up.svg" alt="Increase" width={17} height={17} />
                            }
                            {Math.abs(merchant.successRate || 0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-[24px] text-primary font-[700] text-right">{merchant.successRate}</p>
                    </div>

                    {/* Action Buttons - Use currentMerchantStatus for real-time updates */}
                    {currentMerchantStatus === "Active" ? (
                      <div className="flex justify-between gap-4 w-full">
                        <button
                          className="w-[40%] rounded-[8px] border-[1px] border-[#DF1D1D] py-2 font-[700] text-[#DF1D1D] bg-white hover:bg-red-50 disabled:opacity-50"
                          onClick={handleSuspendConfirmation}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && actionType === "suspend" ? "Suspending..." : "Suspend"}
                        </button>
                        <button
                          className="w-[20%] rounded-[8px] bg-[#E21B1B] py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={handleBanConfirmation}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && actionType === "ban" ? "Banning..." : "Ban"}
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          className="w-full rounded-[8px] bg-primary py-2 font-[700] text-white hover:bg-blue-700 disabled:opacity-50"
                          onClick={handleActivateConfirmation}
                          disabled={isSubmitting}
                        >
                          {isSubmitting && actionType === "activate" ? "Activating..." : "Activate Merchant"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Bank Accounts Tab (using the BankAccountsTab component) */}

              </div>
            )
              : (
                <div className="px-6 py-8">
                  <BankAccountsTab
                    isLoading={isLoading}
                    isError={error}
                    action={action}
                    accounts={accounts}
                    onVerifyAccount={handleVerifyAccount}
                    onDenyVerification={handleDenyVerification}
                  />
                </div>
              )}


          </div>

        </div>
      </div>

      {/* Replace ConfirmModal with SuspendUserModal for suspend actions */}
      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        userName={
          merchant.name
            ? merchant.name.firstName + " " + merchant.name.lastName
            : "N/A"
        }
        onConfirm={(days) => executeSuspendMerchant(days)}
        isLoading={isSubmitting}
      />

      {/* Activate Merchant Confirmation Modal */}
      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => !isSubmitting && setShowActivateModal(false)}
        onConfirm={executeActivateMerchant}
        title="Activate Merchant"
        message="Are you sure you want to activate this merchant? They will regain access to their account."
        warningText="This action will restore the merchant's account access."
        cancelText="Cancel"
        confirmText="Activate Merchant"
        isLoading={isSubmitting}
        style="blue"
      />

      {/* Ban Merchant Confirmation Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => !isSubmitting && setShowBanModal(false)}
        onConfirm={executeBanMerchant}
        title="Ban Merchant"
        message="Are you sure you want to ban this merchant? They will lose access to their account permanently."
        warningText="This user will not be able to access their account."
        cancelText="Cancel"
        confirmText="Ban Merchant"
        isLoading={isSubmitting}
        style="red"
      />
    </>
  );
}