"use client";

import { useState } from "react";
import Image from "next/image";
import BankAccountDetails from "./BankAccountDetails";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  isVerified: boolean;
  isPending: boolean;
}

interface BankAccountItemProps {
  account: BankAccount;
  onVerify: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
  isExpanded: boolean; // Add this prop to manage the expanded state
  onExpandToggle: () => void; // Add this prop to handle the toggle
}

export default function BankAccountItem({
  account,
  onVerify,
  onDenyVerification,
  isExpanded,
  onExpandToggle, // Add this prop to handle the toggle
}: BankAccountItemProps) {
  const toggleDetails = () => {
    onExpandToggle();
  };

  return (
    <div>
      <div
        className={`border-black/10 ${
          isExpanded ? "border-t-1" : "rounded-[12px] border-1"
        } px-[12px] py-[20px] `}
      >
        {/* Bank Account Item Row */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleDetails}
        >
          <span className="text-[16px] font-[700]">{account.bankName}</span>
          {account.isVerified ? (
            <Image
              src="/icons/verified bank.svg"
              alt="Verified"
              width={24}
              height={24}
            />
          ) : account.isPending ? (
            <Image
              src="/icons/pending bank.svg"
              alt="Pending Verification"
              width={24}
              height={24}
            />
          ) : (
            <span className="w-6 h-6"></span> // Empty placeholder for alignment
          )}
        </div>

        {/* Expanded Details Section */}
      </div>
      {isExpanded && (
        <BankAccountDetails
          account={account}
          onVerify={onVerify}
          onDenyVerification={onDenyVerification}
        />
      )}
    </div>
  );
}
