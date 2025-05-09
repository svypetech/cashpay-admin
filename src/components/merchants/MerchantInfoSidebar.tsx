"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Tabs from "../ui/Tabs"; // Import the Tabs component
import BankAccountsTab from "./BankAccountsTab";

interface Merchant {
  userId: string;
  name: string;
  email: string;
  tradesCompleted: number;
  successRate: string;
  status: string;
  joinDate?: string;
  activeTime?: number;
  views?: number;
  successRateChange: number;
  viewsRate?: number;
  pendingBankVerification?: boolean; // Add this property to show the orange dot
}

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  isVerified: boolean;
  isPending: boolean;
}

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
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "bank1",
      bankName: "Meezan Bank",
      accountHolder: "Jane Doe",
      accountNumber: "8787238239293",
      iban: "PK3287872382392923",
      isVerified: true,
      isPending: false
    },
    {
      id: "bank2",
      bankName: "EasyPaisa",
      accountHolder: "Jane Doe",
      accountNumber: "8787238239293",
      iban: "PK3287872382392923",
      isVerified: false,
      isPending: true
    },
    {
      id: "bank3",
      bankName: "EasyPaisa",
      accountHolder: "Jane Doe",
      accountNumber: "8787238239293", 
      iban: "PK3287872382392923",
      isVerified: false,
      isPending: true
    },
    {
      id: "bank4",
      bankName: "Google Pay",
      accountHolder: "Jane Doe",
      accountNumber: "8787238239293",
      iban: "PK3287872382392923",
      isVerified: true,
      isPending: false
    }
  ]);

  // Format join date nicely
  const formattedDate = merchant.joinDate || "19-03-20";
  
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

  const handleVerifyAccount = (accountId: string) => {
    setBankAccounts(accounts => 
      accounts.map(account => 
        account.id === accountId 
          ? { ...account, isVerified: true, isPending: false } 
          : account
      )
    );
  };

  const handleDenyVerification = (accountId: string) => {
    setBankAccounts(accounts => 
      accounts.map(account => 
        account.id === accountId 
          ? { ...account, isPending: false } 
          : account
      )
    );
  };

  if (!showSidebar) return null;

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-2xl font-bold">User Profile</h2>
            <button
              onClick={onClose}
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
              {merchant.pendingBankVerification && (
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
                  src="/images/user-avatar.png"
                  alt={merchant.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <h3 className="mb-2 text-xl font-bold">
              {merchant.name}
            </h3>
            <p className="mb-6 text-[13px] text-[#1D1D1D]">User-ID: {merchant.userId}</p>

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
                  <p className="text-gray-600">{formattedDate}</p>
                
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
                    <p className="text-[24px] text-primary font-[700]">40 hours</p>
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
                          {merchant.viewsRate ? 
                            <Image src="/icons/Arrow up.svg" alt="Increase" width={17} height={17} /> : 
                            <Image src="/icons/Arrow down.svg" alt="Decrease" width={17} height={17} />
                          } 
                          {Math.abs(merchant.viewsRate || 0)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-[24px] text-primary font-[700]">200K</p>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="rounded-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Image src="/icons/merchant success.svg" alt="Success Rate" width={28} height={28} />
                      <span className="text-[16px] font-[400] text-gray">Success Rate</span>
                    </div>
                    <div className={`text-sm font-medium flex ${merchant?.successRateChange < 5 ? "text-red-500" : "text-green-500"}`}>
                      <span className="flex">
                        {merchant.successRateChange < 5 ? 
                          <Image src="/icons/Arrow down.svg" alt="Decrease" width={17} height={17} /> : 
                          <Image src="/icons/Arrow up.svg" alt="Increase" width={17} height={17} />
                        } 
                        {Math.abs(merchant.successRateChange || 0)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-[24px] text-primary font-[700] text-right">{merchant.successRate}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-4 w-full">
                  <button 
                    className="w-[40%] rounded-[8px] border-[1px] border-[#DF1D1D] py-2 font-[700] text-[#DF1D1D] bg-white"
                    onClick={() => onSuspend(merchant.userId)}
                  >
                    Suspend
                  </button>
                  <button 
                    className="w-[20%] rounded-[8px] bg-[#E21B1B] py-2 font-medium text-white"
                    onClick={() => onBan(merchant.userId)}
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
                accounts={bankAccounts}
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