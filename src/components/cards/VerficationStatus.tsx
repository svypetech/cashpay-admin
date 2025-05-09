"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"


interface PersonalDetails {
  name: string
  dob: string
  region: string
}

interface Document {
  fileName: string
  url: string // URL of the document
}

interface VerificationAccordionProps {
  personalDetails: PersonalDetails
  document: Document
  selfieDocument: Document
}

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageUrl, title }: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageUrl: string;
  title: string;
}) => {
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
          />
        </div>
      </div>
    </div>
  );
};

export default function VerificationAccordion({
  personalDetails,
  document,
  selfieDocument,
}: VerificationAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const openImageModal = (url: string, title: string) => {
    setModalImage({ url, title });
  }

  const closeImageModal = () => {
    setModalImage(null);
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto border border-gray-100 rounded-lg">
        {/* Personal Details Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full cursor-pointer flex items-center justify-between px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleSection("personal")}
          >
            <span className="text-gray-800">Personal Details</span>
            {openSection === "personal" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === "personal" && personalDetails && (
            <div className="px-6 pb-4">
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-black">Name:</span> {personalDetails.name}
                </div>
                <div>
                  <span className="font-bold text-black">DOB:</span> {personalDetails.dob}
                </div>
                <div>
                  <span className="font-bold text-black">Nationality:</span> {personalDetails.region}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full cursor-pointer flex items-center justify-between px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleSection("documents")}
          >
            <span className="text-gray-800">Documents</span>
            {openSection === "documents" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === "documents" && (
            <div className="px-6 pb-4">
              <div className="flex flex-col items-start space-y-2 py-2">
                <div className="flex items-center space-x-3">
                  {document.url ? (
                    <div 
                      className="cursor-pointer border border-gray-200 rounded-md overflow-hidden"
                      onClick={() => openImageModal(document.url, "Document")}
                    >
                      <img 
                        src={document.url} 
                        alt={document.fileName} 
                        className="w-[80px] h-[60px] object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-primary">Document not submitted</p>
                  )}

                  {document.url && <span className="text-gray-700">{document.fileName}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selfie Section */}
        <div>
          <button
            className="w-full cursor-pointer flex items-center justify-between px-6 py-4 text-left focus:outline-none"
            onClick={() => toggleSection("selfie")}
          >
            <span className="text-gray-800">Selfie</span>
            {openSection === "selfie" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === "selfie" && (
            <div className="px-6 pb-4">
              <div className="flex flex-col items-start space-y-2 py-2">
                <div className="flex items-center space-x-3">
                  {selfieDocument.url ? (
                    <div 
                      className="cursor-pointer border border-gray-200 rounded-md overflow-hidden"
                      onClick={() => openImageModal(selfieDocument.url, "Selfie")}
                    >
                      <img 
                        src={selfieDocument.url} 
                        alt={selfieDocument.fileName} 
                        className="w-[80px] h-[60px] object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-primary">Document not submitted</p>
                  )}
                  {selfieDocument.url && <span className="text-gray-700">{selfieDocument.fileName}</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={!!modalImage} 
        onClose={closeImageModal} 
        imageUrl={modalImage?.url || ''} 
        title={modalImage?.title || ''}
      />
    </>
  )
}