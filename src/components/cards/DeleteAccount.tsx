import React, { ReactNode } from "react";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string | ReactNode;
  warningText?: string | ReactNode;
  cancelText?: string;
  confirmText?: string;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  warningText,
  cancelText = "Cancel",
  confirmText = "Confirm"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
      
      {/* Modal - added custom shadow */}
      <div 
        className="bg-white rounded-[20px] relative z-10 w-full max-w-[624px] min-h-[400px] sm:h-[400px] overflow-hidden"
        style={{ boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.25)' }}
      >
        {/* Close button - absolute positioned in corner */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Content container with specified padding */}
        <div className="py-[30px] px-[30px] md:px-[40px] md:py-[20px] h-full flex flex-col justify-center">
          {/* Header */}
          <h4 className="text-[25px] font-[700] border-b border-gray-200 pb-4 mb-10">
            {title}
          </h4>
          
          {/* Message */}
          <div className="text-center flex flex-col justify-center">
            <p className="text-lg mb-2">{message}</p>
            {warningText && (
              <p className="text-[#FF1B1B] text-sm">{warningText}</p>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-[20px] mt-[70px]">
            <button 
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border-[1px] border-[#DF1D1D] text-[#DF1D1D] font-medium cursor-pointer flex items-center justify-center"
            >
              {cancelText}
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-2 rounded-lg bg-[#DF1D1D] text-white font-medium hover:bg-red-700 flex items-center justify-center cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountDialog;