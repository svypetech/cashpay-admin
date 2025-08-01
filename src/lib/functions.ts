import { formatDistanceToNow, format, parseISO, startOfDay } from "date-fns";
import { Message, P2PMessage } from "../Types/chat";

export const handleTokenExpiration = () => {
      // Clear user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to sign-in page
      window.location.href = "/signin"; // Adjust the path as needed
    }

export function shortenAddress(address: string, chars = 6): string {
  if (!address) return "-";

  if (address.length <= chars * 2 + 2) return address;

  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function timeAgo(dateString: string) {
  const formatted = formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });
  return formatted.replace(/^about\s/, ""); // Remove 'about ' if it appears at the start
}

export // Format joining date using date-fns
const formatJoiningDate = (dateString: string) => {
  try {
    // Check if the date is already in a simple format
    if (dateString.includes("-") && dateString.length <= 10) {
      return dateString;
    }

    // Try to parse the date
    const date = parseISO(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }

    // Format as YYYY-MM-DD
    return format(date, "yyyy-MM-dd");

    // Alternative formats:
    // return format(date, 'MM/dd/yyyy'); // MM/DD/YYYY
    // return format(date, 'dd/MM/yyyy'); // DD/MM/YYYY
    // return format(date, 'MMM d, yyyy'); // Apr 1, 2025
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original on error
  }
};

export function cal_USDT_Value({
  balance,
  contract_decimals,
  quote_rate,
}: {
  balance: string;
  contract_decimals: number;
  quote_rate: number;
}) {
  console.log("quote_rate", quote_rate);
  const usdtValue = (Number(balance) / 10 ** contract_decimals) * quote_rate;
  return usdtValue;
}

export const formatNumberToTwoDecimals = (value: number): string => {
  if (isNaN(value)) {
    return "0.00"; // Return default value for NaN
  }
  if (value === null || value === undefined) {
    return "0.00"; // Return default value for null or undefined
  }
  // Convert to string and split by decimal point
  const [whole, decimal] = value.toString().split(".");

  // If there's no decimal part, add .00
  if (!decimal) {
    return `${whole}.00`;
  }

  // If decimal part is shorter than 2 digits, pad with zeros
  if (decimal.length === 1) {
    return `${whole}.${decimal}0`;
  }

  // If decimal part is longer than 2 digits, truncate (not round)
  if (decimal.length > 2) {
    return `${whole}.${decimal.substring(0, 2)}`;
  }

  // Return the original number if it already has exactly 2 decimal places
  return `${whole}.${decimal}`;
};

export const formatMessageTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Format as 12-hour time with AM/PM
    return format(date, "h:mm a"); // Example: "2:45 PM"
  } catch (error) {
    console.error("Time formatting error:", error);
    return "";
  }
};

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

  messages.forEach((message) => {
    try {
      // Get the date part only, without time
      const messageDate = new Date(message.date);
      const dateKey = startOfDay(messageDate).toISOString();

      // Store with original date for display formatting later
      const existingMessages = groups.get(dateKey) || [];
      groups.set(dateKey, [...existingMessages, message]);
    } catch (error) {
      console.error("Error parsing message date:", error, message);
    }
  });

  // Convert map to array and sort by date
  return Array.from(groups.entries())
    .map(([dateKey, messages]) => ({
      date: dateKey,
      messages: messages.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


export const getFileIcon = (fileType: string): string => {
  if (fileType.includes("pdf")) return "/images/pdf2.png";
  if (fileType.includes("image")) return "/icons/image.svg";
  if (fileType.includes("doc") || fileType.includes("word"))
    return "/icons/document.svg";
  return "/icons/file.svg";
};

export const formatFileSize = (size: number): string => {
  return `${Math.round(size / 1024)} KB`;
};


export function isUserActive(status: string): boolean {
  if (!status) return false; // Handle undefined or null status
  return status.toLowerCase() !== "banned" && status.toLowerCase() !== "suspend";
}

interface P2PMessageGroup {
  date: string;
  messages: P2PMessage[];
}

export function groupP2PMessagesByDate(messages: P2PMessage[]): P2PMessageGroup[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  // Create a map to group messages by date
  const groups: Map<string, P2PMessage[]> = new Map();

  messages.forEach((message) => {
    try {
      // Get the date part only, without time
      const messageDate = new Date(message.date);
      const dateKey = startOfDay(messageDate).toISOString();

      // Store with original date for display formatting later
      const existingMessages = groups.get(dateKey) || [];
      groups.set(dateKey, [...existingMessages, message]);
    } catch (error) {
      console.error("Error parsing message date:", error, message);
    }
  });

  // Convert map to array and sort by date
  return Array.from(groups.entries())
    .map(([dateKey, messages]) => ({
      date: dateKey,
      messages: messages.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}