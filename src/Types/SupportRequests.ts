export interface SupportRequest {
  _id: string;
  userId: string;
  issueType: string;
  status: string;
  date: string;
  __v: number;
  updateDate: string;
  assignedTo?: string;
}