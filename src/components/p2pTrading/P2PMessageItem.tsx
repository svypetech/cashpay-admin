import { useState } from "react";
import Image from "next/image";
import { P2PMessage } from "@/src/Types/chat";
import { formatMessageTime, getFileIcon } from "../CustomerSupport/functions";
import ImageModal from "../ui/ImageModal";
import FileModal from "../ui/FileModal";

interface MessageItemProps {
  message: P2PMessage;
  isFromCurrentUser: boolean;
  isTemp?: boolean;
  showStatus?: boolean;
}

export default function P2PMessageItem({
  message,
  isFromCurrentUser,
  isTemp = false,
  showStatus = false,
}: MessageItemProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  // Get filename from message text for temporary messages
  const getTempFileName = () => {
    if (message.message) {
      // Extract filename from message text (assuming format: "filename.ext" or "filename.ext\noptional message")
      const lines = message.message.split('\n');
      const firstLine = lines[0];
      if (firstLine.includes('.')) {
        return firstLine;
      }
    }
    return "File";
  };

  // Determine file type for temporary messages based on message content
  const getTempFileType = () => {
    const fileName = getTempFileName();
    if (fileName.includes('.pdf')) return 'pdf';
    if (fileName.includes('.doc') || fileName.includes('.docx')) return 'doc';
    if (fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.gif') || fileName.includes('.webp')) return 'image';
    return 'file';
  };

  // Enhanced file detection - for temp messages, check the filename in the message text
  const isImageFile = message.image && (
    isTemp ? 
      // For temp messages, check the filename in the message text
      getTempFileType() === 'image'
    :
      // For actual messages, check the URL
      (message.image.includes(".jpg") || 
       message.image.includes(".png") || 
       message.image.includes(".gif") || 
       message.image.includes(".jpeg") ||
       message.image.includes(".webp") ||
       message.image.includes(".svg") ||
       message.image.includes("/svg+xml") ||
       message.image.includes("image/svg+xml") || 
       message.image.includes("image/png") ||    
       message.image.includes("image/jpg") ||
       message.image.includes("image/jpeg") ||
       message.image.includes("image/gif") ||
       message.image.includes("image/webp") ||
       message.image.startsWith("data:image/"))
  );

  const isPdfFile = message.image && (
    isTemp ?
      getTempFileType() === 'pdf'
    :
      (message.image.includes(".pdf") || 
       message.image.includes("application/pdf"))
  );

  const isDocFile = message.image && (
    isTemp ?
      getTempFileType() === 'doc'
    :
      (message.image.includes(".doc") || 
       message.image.includes(".docx") ||
       message.image.includes("application/msword") ||
       message.image.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
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
    if (message.image && isImageFile && !isTemp) {
      setShowImageModal(true);
    }
  };

  const handleFileClick = () => {
    if (message.image && !isTemp) {
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
      window.open(message.image, '_blank');
    }
  };

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
                    className={`relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden group ${!isTemp ? 'cursor-pointer' : ''}`}
                    onClick={handleImageClick}
                  >
                    {isTemp ? (
                      /* Temporary Image Loading State */
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="flex flex-col items-center gap-2">
                          <svg
                            className="w-8 h-8 text-gray-400 animate-pulse"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                          </svg>
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3 text-gray-500 animate-spin"
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
                            <span className="text-xs text-gray-500">Uploading...</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Actual Image */
                      <>
                        <img
                          src={message.image}
                          alt="Shared image"
                          className="object-contain w-full h-full transition-transform duration-200"
                          onError={(e) => {
                            // You could set a fallback here if needed
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
                      </>
                    )}
                  </div>
                ) : (
                  /* File Display */
                  <div 
                    className={`flex items-center gap-3 p-3 bg-white/10 rounded-lg transition-colors ${!isTemp ? 'cursor-pointer hover:bg-white/20' : ''}`}
                    onClick={handleFileClick}
                  >
                    <div className="bg-white p-2 rounded">
                      {isTemp ? (
                        /* Temporary File Icon with Loading */
                        <div className="relative">
                          <Image 
                            src={getFileIcon(getTempFileType())} 
                            alt="File" 
                            width={24} 
                            height={24} 
                            className="opacity-70"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-gray-600 animate-spin"
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
                        </div>
                      ) : (
                        /* Actual File Icon */
                        <Image 
                          src={getFileIcon(message.image)} 
                          alt="File" 
                          width={24} 
                          height={24} 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isFromCurrentUser ? "text-white" : "text-gray-800"
                      }`}>
                        {isTemp ? getTempFileName() : getFileName()}
                      </p>
                      <p className={`text-xs ${
                        isFromCurrentUser ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {isTemp ? "Uploading..." : "Click to view"}
                      </p>
                    </div>
                    {isTemp && (
                      <div className="flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white text-opacity-70 animate-spin"
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

            {/* Show loading indicator for temp text messages only */}
            {isTemp && !message.image && (
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