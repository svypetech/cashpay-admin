"use client";

import { useState } from "react";
import BankAccountItem from "./BankAccountItem";
import { MerchantBankAccount } from "@/src/Types/Merchant";

interface BankAccountsTabProps {
  action: {
    isLoading: boolean;
    type: string;
  }
  accounts: MerchantBankAccount[];
  onVerifyAccount: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
}

export default function BankAccountsTab({
  action,
  accounts,
  onVerifyAccount,
  onDenyVerification,
}: BankAccountsTabProps) {
    const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  
    const handleExpandToggle = (accountId: string) => {
        setExpandedAccountId(expandedAccountId === accountId ? null : accountId);
    };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-6">Accounts</h2>
      
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
    </div>
  );
}