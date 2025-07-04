// src/components/ui/FileModal.tsx
"use client";

import { useState } from "react";

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
  onDownload: () => void;
  title: string;
}

export default function FileModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
  onDownload,
  title,
}: FileModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const isImage = fileType.startsWith('image/') || 
    fileUrl.includes('.jpg') || fileUrl.includes('.png') || 
    fileUrl.includes('.gif') || fileUrl.includes('.jpeg') ||
    fileUrl.includes('.webp') || fileUrl.includes('.svg');

  const isPdf = fileType.includes('pdf') || fileUrl.includes('.pdf');

  const isDoc = fileType.includes('word') || fileType.includes('document') ||
    fileUrl.includes('.doc') || fileUrl.includes('.docx') ||
    fileType.includes('application/msword') ||
    fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  const isVideo = fileType.startsWith('video/') || 
    fileUrl.includes('.mp4') || fileUrl.includes('.webm') ||
    fileUrl.includes('.mov');

  // For Word docs, we'll use Google Docs viewer or Office Online viewer
  const getDocViewerUrl = (url: string) => {
    // Try Google Docs viewer first (works well with most formats)
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };

  // Alternative viewer for Office documents
  const getOfficeViewerUrl = (url: string) => {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {fileName}
            </h3>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {isImage && (
            <div className="flex justify-center">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}

          {isPdf && (
            <div className="w-full h-96 md:h-[500px]">
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full border-0"
                title={fileName}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}

          {isDoc && (
            <div className="w-full h-96 md:h-[500px]">
              <iframe
                src={getDocViewerUrl(fileUrl)}
                className="w-full h-full border-0"
                title={fileName}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  // If Google Docs viewer fails, try Office viewer
                  const iframe = document.querySelector('iframe[title="' + fileName + '"]') as HTMLIFrameElement;
                  if (iframe) {
                    iframe.src = getOfficeViewerUrl(fileUrl);
                  }
                }}
              />
            </div>
          )}

          {isVideo && (
            <div className="flex justify-center">
              <video
                controls
                className="max-w-full max-h-full"
                onLoadedData={() => setIsLoading(false)}
              >
                <source src={fileUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {!isImage && !isPdf && !isVideo && !isDoc && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#6B7280"/>
                  <path d="M14 2V8H20" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{fileName}</h3>
              <p className="text-gray-500 mb-4 text-center">
                This file type cannot be previewed in the browser.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <svg
                className="w-8 h-8 animate-spin text-primary"
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
      </div>
    </div>
  );
}