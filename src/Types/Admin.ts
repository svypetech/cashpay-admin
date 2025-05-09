export interface Admin {
  canAccessApiLogs: boolean;
  canAccessSystemSettings: boolean;
  canApproveKyc: boolean;
  canResolveDispute: boolean;
  canViewTransactions: boolean;
  createdBy: string;
  date: string; // ISO date string
  description: string;
  email: string;
  name?: string;
  password: string;
  id: number;
  isBan: boolean;
  isDeleted: boolean;
  isSuspend: boolean;
  role: string;
  title: string;
  __v: number;
  _id: string;
  userStatus?: string;
  image?: string;
  imagePath?: string;
}
