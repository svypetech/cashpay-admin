"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ErrorPopup({
  isOpen,
  onClose,
  title = "Error",
  message,
  autoClose = false,
  autoCloseDelay = 5000,
}: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldSlideIn, setShouldSlideIn] = useState(false);

  // Auto close functionality
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        setShouldSlideIn(true);
      }, 10);
    } else {
      setShouldSlideIn(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShouldSlideIn(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          shouldSlideIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all duration-300 ${
            shouldSlideIn
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close error popup"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-2">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 pt-4">
            <button
              onClick={handleClose}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>

          {/* Auto-close progress bar */}
          {autoClose && isOpen && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all ease-linear"
                style={{
                  width: "100%",
                  animation: `shrink ${autoCloseDelay}ms linear`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}