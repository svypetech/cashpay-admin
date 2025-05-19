export default interface Merchant {
  userId: number;
  _id: string;
  name: {
    firstName?: string;
    lastName?: string;
  };
  email: string;
  verified: boolean;
  image?: string;
  joinedDate: string;
  activeTime: number;
  views: number;
  totalTrades: number;
  completedTrades: number;
  successRate: number;
}

export interface MerchantBankAccount {
  id: string;
  createdBy: string;
  bankName: string;
  fullName: string;
  accountNumber: string;
  IBANnumber: string;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
}