export interface User {
    _id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    date: string;
    verificationStatus: string;
    KycProfileAdded: boolean;
    KycIdDocAdded: boolean;
    KycSellfieAdded: boolean;
    DOB: string;
    region: string;
    canApproveKyc: boolean;
    idDocUrl: string;
    selfieUrl: string;
    suspendDate?: string;
    updateDate: string;
    lastLoginDate: string;
    totalLogin: number;
    averageTime: number;
    loginFrequency: number;
    sessionDuration: number;
    totalTime: number;
    lastActivity: string
    userStatus: string;
  }

  
export type DashboardUser = {
  name: {
    firstName: string;
    lastName: string;
  };
  contact: {
    code: string;
    number: string;
  };
  status: string;
  email: string;
  transactionCount: number;
};
