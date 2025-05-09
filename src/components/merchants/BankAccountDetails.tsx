"use client";

import Image from "next/image";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  isVerified: boolean;
  isPending: boolean;
}

interface BankAccountDetailsProps {
  account: BankAccount;
  onVerify: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
}

export default function BankAccountDetails({
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
        <div className="text-right font-[700]">{account.accountHolder}</div>

        <div className="text-gray-500">Account No.</div>
        <div className="text-right font-[700]">{account.accountNumber}</div>

        <div className="text-gray-500">IBAN</div>
        <div className="text-right font-[700]">{account.iban}</div>
      </div>
      
      {/* Action buttons - only show for pending accounts */}
      
    </div>
    {account.isPending && (
        <div className="flex justify-between gap-4 mt-6">
          <button 
            onClick={() => onDenyVerification(account.id)}
            className="w-[40%] rounded-[12px] border-1 border-[#DF1D1D] py-2 font-medium text-[#DF1D1D]"
          >
            Deny Verification
          </button>
          <button 
            onClick={() => onVerify(account.id)}
            className="w-[40%] rounded-[12px] bg-[#0D2A91] py-2 font-medium text-white"
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
}