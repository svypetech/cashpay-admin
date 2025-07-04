
import { useState } from "react";
import Image from "next/image";
import { Message } from "@/src/Types/chat";
import { formatMessageTime, getFileIcon } from "./functions";
import ImageModal from "../ui/ImageModal";
import FileModal from "../ui/FileModal";

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  // Enhanced file detection based on your URL patterns
  const isImageFile = message.image && (
    message.image.includes(".jpg") || 
    message.image.includes(".png") || 
    message.image.includes(".gif") || 
    message.image.includes(".jpeg") ||
    message.image.includes(".webp") ||
    message.image.includes(".svg") ||
    message.image.includes("/svg+xml") ||  // For your SVG URLs
    message.image.includes("image/svg+xml") || 
    message.image.includes("image/png") ||    
    message.image.includes("image/jpg") ||
    message.image.includes("image/jpeg") ||
    message.image.includes("image/gif") ||
    message.image.includes("image/webp") ||
    message.image.startsWith("data:image/") ||
    message.image.startsWith("blob:")
  );

  const isPdfFile = message.image && (
    message.image.includes(".pdf") || 
    message.image.includes("application/pdf")
  );

  const isDocFile = message.image && (
    message.image.includes(".doc") || 
    message.image.includes(".docx") ||
    message.image.includes("application/msword") ||
    message.image.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  );

  const getFileName = () => {
    if (!message.image) return "";
    const url = message.image;
    return url.split("/").pop()?.split("?")[0] || url.split("\\").pop() || "File";
  };

  const getFileType = () => {
    return message.image || "";
  };

  const handleImageClick = () => {
    console.log('Image clicked:', message.image, 'isImageFile:', isImageFile);
    if (message.image && isImageFile) {
      setShowImageModal(true);
    }
  };

  const handleFileClick = () => {
    console.log('File clicked:', message.image, 'isImageFile:', isImageFile);
    if (message.image) {
      if (isImageFile) {
        setShowImageModal(true);
      } else {
        setShowFileModal(true);
      }
    }
  };

  const handleFileDownload = async () => {
    if (!message.image || isTemp) return;

    try {
      const response = await fetch(message.image);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName();
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(message.image, '_blank');
    }
  };

  console.log('File detection for:', message.image, {
    isImageFile,
    isPdfFile,
    isDocFile,
    messageImage: message.image
  });

  return (
    <>
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
            {/* Display file content */}
            {message.image && (
              <div className="mb-2">
                {isImageFile ? (
                  /* Image Display */
                  <div 
                    className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={handleImageClick}
                  >
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="object-contain w-full h-full transition-transform duration-200"
                      onError={(e) => {
                        console.error('Image failed to load:', message.image);
                        // You could set a fallback here if needed
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', message.image);
                      }}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 3H6C4.89 3 4 3.89 4 5V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V8L15 3Z" fill="white" fillOpacity="0.8"/>
                          <path d="M15 3V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* File Display */
                  <div 
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={handleFileClick}
                  >
                    <div className="bg-white p-2 rounded">
                      <Image 
                        src={getFileIcon(message.image)} 
                        alt="File" 
                        width={24} 
                        height={24} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isFromCurrentUser ? "text-white" : "text-gray-800"
                      }`}>
                        {getFileName()}
                      </p>
                      <p className={`text-xs ${
                        isFromCurrentUser ? "text-blue-100" : "text-gray-500"
                      }`}>
                        Click to view
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Message text content */}
            {message.message && (
              <p className="text-sm">
                {message.message}
              </p>
            )}

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

      {/* Image Modal for images and SVGs */}
      {isImageFile && !isTemp && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageUrl={message?.image || ""}
          title={`Image shared ${formatMessageTime(message.date)}`}
        />
      )}

      {/* File Modal for PDFs, documents, and other files */}
      {message.image && !isTemp && !isImageFile && (
        <FileModal
          isOpen={showFileModal}
          onClose={() => setShowFileModal(false)}
          fileUrl={message.image}
          fileName={getFileName()}
          fileType={getFileType()}
          onDownload={handleFileDownload}
          title={`File shared ${formatMessageTime(message.date)}`}
        />
      )}
    </>
  );
}