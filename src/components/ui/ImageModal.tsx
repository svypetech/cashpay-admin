"use client";

import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-70" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="bg-white rounded-[20px] relative z-10 w-full max-w-[90%] max-h-[90%] overflow-hidden"
        style={{ boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.25)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-xl font-semibold">{title}</h4>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Image Container */}
        <div className="relative w-full h-[80vh] overflow-auto flex items-center justify-center p-4">
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
}