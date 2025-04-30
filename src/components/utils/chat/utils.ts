import { Message } from '@/lib/types/chat';

export const getFileIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return '/icons/pdf.svg';
  if (fileType.includes('image')) return '/icons/image.svg';
  if (fileType.includes('doc') || fileType.includes('word')) return '/icons/doc.svg';
  return '/icons/file.svg';
};

export const formatFileSize = (size: number): string => {
  return `${Math.round(size / 1024)} KB`;
};

export const groupMessagesByDate = (messages: Message[]) => {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  let currentGroup: Message[] = [];
  
  messages.forEach(message => {
    const date = 'Today'; // Use actual date logic in production
    
    if (date !== currentDate) {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate, messages: currentGroup });
      }
      currentDate = date;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });
  
  if (currentGroup.length > 0) {
    groups.push({ date: currentDate, messages: currentGroup });
  }
  
  return groups;
};

export const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Dolor sit amet, consectetur adipiscing elit. Hendrerit",
    timestamp: "10:45 AM",
    sender: "agent",
  },
  {
    id: "2",
    content: "Dolor sit amet, consectetur adipiscing elit. Hendrerit vulputate viverra commodo tristique",
    timestamp: "10:47 AM",
    sender: "user",
  },
  {
    id: "3",
    content: "Can you send the file of Martin's UX case study and the link to wireframe?",
    timestamp: "10:50 AM",
    sender: "user",
  },
  {
    id: "4",
    content: "Yes, Here it is",
    timestamp: "10:52 AM",
    sender: "agent",
    attachment: {
      name: "Martin's UX case study",
      size: "20 Jun, 2022 • 298 KB",
      type: "pdf",
      url: "/files/sample.pdf",
    },
  },
  {
    id: "5",
    content: "Thank you 🙂",
    timestamp: "10:55 AM",
    sender: "user",
  },
  {
    id: "6",
    content: "You are welcome 🙂",
    timestamp: "10:56 AM",
    sender: "agent",
  },
  {
    id: "7",
    content: "Yes, Here it is",
    timestamp: "10:52 AM",
    sender: "agent",
    attachment: {
      name: "Martin's UX case study",
      size: "20 Jun, 2022 • 298 KB",
      type: "pdf",
      url: "/files/sample.pdf",
    },
  },
  {
    id: "8",
    content: "Thank you 🙂",
    timestamp: "10:55 AM",
    sender: "user",
  },
  {
    id: "9",
    content: "You are welcome 🙂",
    timestamp: "10:56 AM",
    sender: "agent",
  },
];
