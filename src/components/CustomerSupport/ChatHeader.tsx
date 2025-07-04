import { ChatUser } from "@/src/Types/chat";
import Image from "next/image";

interface ChatHeaderProps {
  user: ChatUser;
  onClose?: () => void;
  isOnline?: boolean;
}

export default function ChatHeader({
  user,
  onClose,
  isOnline = true,
}: ChatHeaderProps) {
  
  return (
    <div className="flex flex-col">
      {/* Header content */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* User avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
              <Image
                src={user.userImage ? user.userImage : "/images/blank-profile.webp"}
                alt={'User Avatar'}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
                unoptimized={user.userImage?.includes("svg")}
              />
            </div>

            {/* Status indicator dot */}
            {/* <div
              className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-success" : "bg-gray-400"
              }`}
            ></div> */}
          </div>
          <div>
            <h3 className="font-semibold font-inter">
              {user.userName ? user.userName.firstName + " " + user.userName.lastName : user.email ? user.email : "N/A"}
            </h3>
            {/* <p className="text-sm text-gray-500 font-inter">{user.userDetails}</p> */}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Styled horizontal line with spacing */}
      <div className="px-4 pb-1">
        <div className="h-[1px] bg-primary7 w-full"></div>
      </div>
    </div>
  );
}