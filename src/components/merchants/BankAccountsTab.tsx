"use client";

import { useState } from "react";
import BankAccountItem from "./BankAccountItem";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  isVerified: boolean;
  isPending: boolean;
}

interface BankAccountsTabProps {
  accounts: BankAccount[];
  onVerifyAccount: (accountId: string) => void;
  onDenyVerification: (accountId: string) => void;
}

export default function BankAccountsTab({
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