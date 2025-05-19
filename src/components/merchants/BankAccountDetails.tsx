"use client";

import { MerchantBankAccount } from "@/src/Types/Merchant";
import Image from "next/image";

interface BankAccountDetailsProps {
  action: {
    isLoading: boolean;
    type: string;
  }
  account: MerchantBankAccount;
  onVerify: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
}

export default function BankAccountDetails({
  action,
  account,
  onVerify,
  onDenyVerification,
}: BankAccountDetailsProps) {
  return (
    <div>
    <div className="rounded-[12px] border-1 border-black/10 my-3 px-4 py-5">
      {/* Bank details header */}
      <div className="flex items-center gap-2 mb-4">
        <Image src="/icons/bank.svg" alt="Bank" width={24} height={24} />
        <span className="text-[14px] font-medium">Bank Details</span>
      </div>

      {/* Bank details grid */}
      <div className="grid grid-cols-2 gap-y-4 text-[14px]">
        <div className="text-gray-500">Bank</div>
        <div className="text-right font-[700]">{account.bankName}</div>

        <div className="text-gray-500">Name</div>
        <div className="text-right font-[700]">{account.fullName}</div>

        <div className="text-gray-500">Account No.</div>
        <div className="text-right font-[700]">{account.accountNumber}</div>

        <div className="text-gray-500">IBAN</div>
        <div className="text-right font-[700]">{account.IBANnumber}</div>
      </div>
      
      {/* Action buttons - only show for pending accounts */}
      
    </div>
    {!account.isVerified && (
        <div className="flex justify-between gap-4 mt-6">
          <button 
            disabled={action.isLoading && action.type === "deny"}
            onClick={() => onDenyVerification(account.id)}
            className="w-[40%] rounded-[12px] border-1 border-[#DF1D1D] py-2 font-medium text-[#DF1D1D]"
          >
            {action.isLoading && action.type === "deny" ? "denying..." : "Deny Verification"}
          </button>
          <button 
            disabled={action.isLoading && action.type === "verify"}
            onClick={() => onVerify(account.id)}
            className="w-[40%] rounded-[12px] bg-[#0D2A91] py-2 font-medium text-white"
          >
            {action.isLoading && action.type === "verify" ? "verifying..." : "Verify"}
          </button>
        </div>
      )}
    </div>
  );
}