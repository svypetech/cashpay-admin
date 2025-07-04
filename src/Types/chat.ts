export interface Message {
  _id: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  senderType: string;
  ticketId: string;
  date: string;
  sender: string;
  __v: number;
  image?: string;
  showStatus?: boolean;
  tempFileInfo?: {
    name: string;
    size: number;
    type: string;
    isUploading: boolean;
  };
}

export interface ChatUser {
    userName: {
      firstName: string;
      lastName: string;
    };
    userImage: string;
    avatar?: string;
    name?:string;
    email?:string
  };

  export interface ChatPreview {
  ticketId: string; 
  date: string; 
  message: string; 
  image: string | null; 
  userName: {
    firstName: string;
    lastName: string;
  } | null; 
  userImage: string | null; 
}

export interface P2PMessage {
  _id: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  senderType: string;
  orderId: string;
  date: string;
  sender: string;
  __v: number;
  image?: string;
  showStatus?: boolean;
  tempFileInfo?: {
    name: string;
    size: number;
    type: string;
    isUploading: boolean;
  };
}
