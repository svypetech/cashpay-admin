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