import { Loader2 } from "lucide-react";
import React, { ReactNode } from "react";

interface SuccessRedirectModalProps {
  isOpen: boolean;
  onRedirect: () => void;
  title?: string;
  message?: string | ReactNode;
  infoText?: string | ReactNode;
  buttonText?: string;
  isLoading?: boolean;
}

const SuccessRedirectModal: React.FC<SuccessRedirectModalProps> = ({
  isOpen,
  onRedirect,
  title = "Success",
  message = "Operation completed successfully",
  infoText,
  buttonText = "Continue",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-30" />

      {/* Modal */}
      <div
        className="bg-white rounded-[20px] relative z-10 w-full max-w-[624px] min-h-[400px] sm:h-[400px] overflow-hidden"
        style={{ boxShadow: "0 0 20px 10px rgba(0, 0, 0, 0.25)" }}
      >
        {/* Content container with specified padding */}
        <div className="py-[30px] px-[30px] md:px-[40px] md:py-[20px] h-full flex flex-col justify-center">
          {/* Header */}
          <h4 className="text-[25px] font-[700] border-b border-gray-200 pb-4 mb-10 min-[405px]:text-left text-center">
            {title}
          </h4>

          {/* Message */}
          <div className="text-center flex flex-col justify-center">
            <p className="text-lg mb-2">{message}</p>
            {infoText && (
              <p className="text-[#FF1B1B] text-sm mt-4">{infoText}</p>
            )}
          </div>

          {/* Single Button */}
          <div className="flex justify-center mt-[70px]">
            <button 
              onClick={isLoading ? undefined : onRedirect} 
              className={`flex-1 max-w-xs py-2 rounded-lg bg-primary text-white font-semibold hover:bg-blue-900 flex items-center justify-center cursor-pointer transition-all ${
                isLoading ? 'bg-primary/70 opacity-80 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting...</span>
                </span>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessRedirectModal;