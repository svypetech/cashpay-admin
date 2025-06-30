import { useState, useRef } from 'react';
import Image from 'next/image';
import { formatFileSize, getFileIcon } from '@/src/lib/functions';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachmentClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (disabled || (newMessage.trim() === '' && !selectedFile)) return;
    
    onSendMessage(newMessage, selectedFile || undefined);
    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* File preview area */}
      {selectedFile && (
        <div className="px-6">
          <div className="bg-primary7 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded">
                  <Image 
                    src={getFileIcon(selectedFile.type)} 
                    alt="File" 
                    width={24} 
                    height={24} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button 
                onClick={removeSelectedFile}
                className="text-gray-500 hover:text-gray-700"
                disabled={disabled}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="pb-6 px-6 -mx-[22px] min-[400px]:-mx-[0px] ">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className={`flex items-center border border-secondary/30 rounded-md overflow-hidden shadow-sm hover:shadow ${disabled ? 'opacity-70' : ''}`}>
          {/* Attachment Button */}
          <button 
            className="flex-shrink-0 p-2 pl-4 cursor-pointer hover:bg-gray-50"
            onClick={handleAttachmentClick}
            disabled={disabled}
          >
            <Image 
              src="/icons/attachment.svg"  
              alt="Attach" 
              width={18} 
              height={18} 
              className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" 
            />
          </button>
          
          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={disabled ? "Connection unavailable..." : "Enter your message"}
            className="flex-1 py-2 px-3 font-[14px] focus:outline-none border-none placeholder:text-[14px]"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={disabled}
          />
          
          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={disabled || (!newMessage.trim() && !selectedFile)}
            className={`flex-shrink-0 min-w-[40px] md:min-w-[48px] p-2 md:p-3 h-[40px] md:h-[48px] rounded-lg flex justify-center items-center m-1 
              ${(newMessage.trim() || selectedFile) && !disabled ? 'bg-primary' : 'bg-primary/50'}`}
          >
            <Image 
              src="/icons/send.svg" 
              alt="Send" 
              width={16} 
              height={16} 
              className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-white" 
            /> 
          </button>
        </div>
      </div>
    </>
  );
}