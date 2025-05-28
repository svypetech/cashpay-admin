"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Tabs from "../ui/Tabs";
import BankAccountsTab from "./BankAccountsTab";
import Merchant from "@/src/Types/Merchant";
import { formatJoiningDate } from "@/src/lib/functions";
import useFetchAccounts from "@/src/hooks/merchants/getMerchankBankAccounts";
import axios from "axios";

interface MerchantInfoSidebarProps {
  showSidebar: boolean;
  onClose: () => void;
  merchant: Merchant;
  onSuspend: (userId: string) => void;
  onBan: (userId: string) => void;
}

export default function MerchantInfoSidebar({
  showSidebar,
  onClose,
  merchant,
  onSuspend,
  onBan,
}: MerchantInfoSidebarProps) {
  const [activeTab, setActiveTab] = useState<"Overview" | "Bank Accounts">("Overview");
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSlideIn, setShouldSlideIn] = useState(false);
  const { accounts: bankAccounts, isLoading, error } = useFetchAccounts(merchant._id);
  const [accounts, setAccounts] = useState(bankAccounts);
  const [action, setAction] = useState({
    isLoading: false,
    type: "",
  });

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
      setIsVisible(true) // Render the sidebar
      // Use a small timeout to ensure DOM is ready before starting animation
      setTimeout(() => {
        setShouldSlideIn(true) // Trigger slide-in animation
      }, 0)
      document.body.style.overflow = "hidden" // Prevent scrolling
    } else {
      setShouldSlideIn(false) // Start slide-out animation
      // Reset active tab when sidebar is closed
      setActiveTab("Overview");
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = "auto" // Re-enable scrolling
      }, 300) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [showSidebar]);

  // Clean up overflow style when component unmounts - ADDED from UserInfoSidebar
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, []);

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
        alert("Account verified successfully");
      }
      else {
        alert("Failed to verify account");
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      alert("An error occurred while verifying the account");
    } finally {
      setAction({ isLoading: false, type: "" });
    }
  };

  const handleDenyVerification = async (accountId: string) => {
    setAction({ isLoading: true, type: "deny" });
    const data = { cardId: accountId }
    try {
      // const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/card/denyCards`, data, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });

      // if (response.data.success) {
      //   alert("Account denied successfully");
      // }
      // else {
      //   alert("Failed to deny account");
      // }
    } catch (error) {
      console.error("Error denying account:", error);
      alert("An error occurred while denying the account");
    } finally {
      setAction({ isLoading: false, type: "" });
    }
  };

  if (!isVisible && !showSidebar) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Overlay with fade animation - UPDATED to match UserInfoSidebar */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar with slide animation - UPDATED to match UserInfoSidebar */}
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
                    src={merchant.image}
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

                  {/* Action Buttons */}
                  <div className="flex justify-between gap-4 w-full">
                    <button
                      className="w-[40%] rounded-[8px] border-[1px] border-[#DF1D1D] py-2 font-[700] text-[#DF1D1D] bg-white"
                      onClick={() => onSuspend(merchant._id)}
                    >
                      Suspend
                    </button>
                    <button
                      className="w-[20%] rounded-[8px] bg-[#E21B1B] py-2 font-medium text-white"
                      onClick={() => onBan(merchant._id)}
                    >
                      Ban
                    </button>
                  </div>
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
  );
}