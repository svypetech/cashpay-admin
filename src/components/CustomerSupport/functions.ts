
import { Message } from '@/src/Types/chat';
import { format, startOfDay } from 'date-fns';

interface MessageGroup {
  date: string;
  messages: Message[];
}

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  // Create a map to group messages by date
  const groups: Map<string, Message[]> = new Map();

  messages.forEach(message => {
    try {
      // Get the date part only, without time
      const messageDate = new Date(message.date);
      const dateKey = startOfDay(messageDate).toISOString();
      
      // Store with original date for display formatting later
      const existingMessages = groups.get(dateKey) || [];
      groups.set(dateKey, [...existingMessages, message]);
    } catch (error) {
      // Skip invalid dates
    }
  });

  // Convert map to array and sort by date
  return Array.from(groups.entries())
    .map(([dateKey, messages]) => ({
      date: dateKey,
      messages: messages.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) {
        return '/icons/image.svg';
    } else if (mimeType.includes('pdf')) {
        return '/images/pdf2.png';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
        return '/icons/document.svg';
    } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
        return '/icons/excel.svg';
    } else if (mimeType.includes('video/')) {
        return '/images/video.png';
    } else if (mimeType.includes('audio/')) {
        return '/images/audio.png';
    } else {
        return '/icons/file.svg';
    }
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};



export  const formatMessageTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format as 12-hour time with AM/PM
      return format(date, 'h:mm a'); // Example: "2:45 PM"
    } catch (error) {
      return '';
    }
  };
