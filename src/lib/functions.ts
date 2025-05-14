import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function shortenAddress(address: string, chars = 6): string {
    if (!address) return "-";

    if (address.length <= chars * 2 + 2) return address;

    if (!address) return "";
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}


export function timeAgo(dateString: string) {
    const formatted = formatDistanceToNow(new Date(dateString), { addSuffix: true });
    return formatted.replace(/^about\s/, ''); // Remove 'about ' if it appears at the start
}


export // Format joining date using date-fns
    const formatJoiningDate = (dateString: string) => {
        try {
            // Check if the date is already in a simple format
            if (dateString.includes('-') && dateString.length <= 10) {
                return dateString;
            }

            // Try to parse the date
            const date = parseISO(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString; // Return original if parsing fails
            }

            // Format as YYYY-MM-DD
            return format(date, 'yyyy-MM-dd');

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
  const [whole, decimal] = value.toString().split('.');
  
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
