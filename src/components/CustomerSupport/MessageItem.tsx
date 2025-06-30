


import { formatMessageTime } from "@/src/lib/functions";
import { Message } from "@/src/Types/chat";

interface MessageItemProps {
  message: Message;
  isFromCurrentUser: boolean;
  isTemp?: boolean;
  showStatus?: boolean;
}

export default function MessageItem({
  message,
  isFromCurrentUser,
  isTemp = false,
  showStatus = false,
}: MessageItemProps) {
  return (
    <div>
      <div
        className={`flex ${
          isFromCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`min-[500px]:w-[318px] w-[258px] rounded-lg px-2 py-2 ${
            isFromCurrentUser
              ? "bg-primary3 text-white"
              : "bg-primary4 text-gray-800"
          }`}
        >
          <p className="text-sm">{message.message}</p>

          {/* Show loading indicator for temp messages */}
          {isTemp && (
            <div className="flex justify-end mt-1">
              <svg
                className="w-3 h-3 text-white text-opacity-70 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

          {/* Message time */}
          <div className="flex justify-end items-center gap-2">
            <div
              className={`text-xs mt-1 text-right ${
                isFromCurrentUser ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {formatMessageTime(message.date)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Read indicator for sent messages - only show for confirmed messages (not temp) */}
      {isFromCurrentUser && !isTemp && showStatus && (
        <p className="text-[10px] text-primary text-end mr-2">
          {message.isRead ? "seen" : "sent"}
        </p>
      )}
    </div>
  );
}