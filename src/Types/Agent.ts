export interface Agent {
  userStatus: string;
  _id: string;
  id: number;
  createdBy: string;
  title: string;
  description: string;
  role: string;
  canViewTransactions: boolean;
  canApproveKyc: boolean;
  canResolveDispute: boolean;
  canAccessApiLogs: boolean;
  canAccessSystemSettings: boolean;
  isDeleted: boolean;
  isSuspend: boolean;
  isBan: boolean;
  email: string;
  password: string;
  date: string;
  __v: number;
  count: number;
}
