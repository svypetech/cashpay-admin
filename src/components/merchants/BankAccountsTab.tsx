"use client";

import { useState } from "react";
import BankAccountItem from "./BankAccountItem";
import { MerchantBankAccount } from "@/src/Types/Merchant";
import { Loader2 } from "lucide-react";

interface BankAccountsTabProps {
  action: {
    isLoading: boolean;
    type: string;
  };
  accounts: MerchantBankAccount[];
  onVerifyAccount: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
  isLoading?: boolean | null;
  isError?: string | null;
}

export default function BankAccountsTab({
  action,
  accounts,
  onVerifyAccount,
  onDenyVerification,
  isLoading = true,
  isError,
}: BankAccountsTabProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(
    null
  );

  const handleExpandToggle = (accountId: string) => {
    setExpandedAccountId(expandedAccountId === accountId ? null : accountId);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6">Accounts</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-red-500">Error: {isError}</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">No accounts found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <BankAccountItem
              action={action}
              key={account.id}
              account={account}
              onVerify={onVerifyAccount}
              onDenyVerification={onDenyVerification}
              isExpanded={expandedAccountId === account.id}
              onExpandToggle={() => handleExpandToggle(account.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
