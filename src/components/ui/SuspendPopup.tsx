"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (days: number) => void;
  userName?: string;
  isLoading?: boolean;
}

const SuspendUserModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName,
  isLoading = false 
}: SuspendUserModalProps) => {
  const [days, setDays] = useState<string>("");
  const [error, setError] = useState<string>("");


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    
    const daysNumber = parseInt(days);
    
    // Validation
    if (!days.trim()) {
      setError("Please enter number of days");
      return;
    }
    
    if (isNaN(daysNumber) || daysNumber <= 0) {
      setError("Please enter a valid number greater than 0");
      return;
    }
    
    if (daysNumber > 365) {
      setError("Suspension period cannot exceed 365 days");
      return;
    }

    setError("");
    onConfirm(daysNumber);
    setDays(""); 
  };

  const handleClose = () => {
    if (!isLoading) {
      setDays("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-30" onClick={isLoading ? undefined : handleClose} />

      {/* Modal - matching ConfirmModal styling */}
      <div
        className="bg-white rounded-[20px] relative z-10 w-full max-w-[624px] min-h-[400px] overflow-hidden"
        style={{ boxShadow: "0 0 20px 10px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Close button - absolute positioned in corner */}
        {!isLoading && (
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Content container with specified padding */}
        <div className="py-[30px] px-[30px] md:px-[40px] md:py-[20px] h-full flex flex-col justify-center">
          {/* Header */}
          <h4 className="text-[25px] font-[700] border-b border-gray-200 pb-4 mb-10 min-[405px]:text-left text-center">
            Suspend User
          </h4>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
            {/* Message */}
            <div className="text-center flex flex-col justify-center mb-6">
              <p className="text-lg mb-2">
                How many days do you want to suspend <strong>{userName}</strong>?
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <input
                id="days"
                type="number"
                min="1" 
                max="365"
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                  setError(""); // Clear error when user types
                }}
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter number of days (1-365)"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-[#FF1B1B]">{error}</p>
              )}
            </div>

            {/* Warning Note */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> The user will be unable to access their account during the suspension period.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-[20px] mt-[20px]">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className={`flex-1 py-2 rounded-lg border-[1px] border-primary text-primary font-semibold cursor-pointer flex items-center justify-center transition-all ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-blue-900 flex items-center justify-center cursor-pointer transition-all ${
                  isLoading ? 'bg-primary/70 opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Please wait...</span>
                  </span>
                ) : (
                  "Suspend"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuspendUserModal;