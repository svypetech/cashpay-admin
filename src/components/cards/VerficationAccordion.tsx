"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { CompleteKycUser } from "@/src/Types/KycUser"

interface VerificationAccordionProps {
  kycUser: CompleteKycUser
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

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function VerificationAccordion({
  kycUser,
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
      <div className="w-full min-w-0 border-b border-gray-100 rounded-lg overflow-hidden">
        {/* Personal Details Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full cursor-pointer flex items-center justify-between py-4 text-left focus:outline-none"
            onClick={() => toggleSection("personal")}
          >
            <span className="text-gray-800 font-medium">Personal Details</span>
            {openSection === "personal" ? (
              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
            )}
          </button>

          {openSection === "personal" && (
            <div className="px-4 pb-4">
              <div className="space-y-3">
                <div className="break-all">
                  <div><span className="font-bold text-black">ID:</span></div>
                  <div className="text-gray-700">{kycUser.id}</div>
                </div>
                <div className="break-all">
                  <div><span className="font-bold text-black">Personal Identification Number:</span></div>
                  <div className="text-gray-700">{kycUser.personalIdentificationNumber}</div>
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Title:</span> {kycUser.title}
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Full Name:</span> {kycUser.firstName} {kycUser.lastName}
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Nationality:</span> {kycUser.nationality}
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Occupation:</span> {kycUser.occupation}
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Date of Birth:</span> {formatDate(kycUser.dateOfBirth)}
                </div>
                <div className="break-words">
                  <span className="font-bold text-black">Place of Birth:</span> {kycUser.placeOfBirth}
                </div>
                <div className="break-all">
                  <div><span className="font-bold text-black">Email:</span></div>
                  <div className="text-gray-700">{kycUser.email}</div>
                </div>
                <div className="break-all">
                  <div><span className="font-bold text-black">Phone Number:</span></div>
                  <div className="text-gray-700">{kycUser.phoneNumber}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Address Section */}
        <div className="border-b border-gray-200">
          <button
            className="w-full cursor-pointer flex items-center justify-between py-4 text-left focus:outline-none"
            onClick={() => toggleSection("address")}
          >
            <span className="text-gray-800 font-medium">Address Information</span>
            {openSection === "address" ? (
              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
            )}
          </button>

          {openSection === "address" && (
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Current Address */}
                <div>
                  <h5 className="font-bold text-black mb-2">Current Address:</h5>
                  <div className="space-y-1 pl-2">
                    <div className="break-words">
                      <div><span className="font-semibold text-gray-700">Street:</span></div>
                      <div className="text-gray-600">{kycUser.address}</div>
                    </div>
                    <div className="break-words">
                      <span className="font-semibold text-gray-700">District:</span> {kycUser.district}
                    </div>
                    <div className="break-words">
                      <span className="font-semibold text-gray-700">City:</span> {kycUser.city}
                    </div>
                    <div className="break-words">
                      <span className="font-semibold text-gray-700">Postal Code:</span> {kycUser.postalCode}
                    </div>
                    <div className="break-words">
                      <span className="font-semibold text-gray-700">Country:</span> {kycUser.country}
                    </div>
                  </div>
                </div>

                {/* Residential Address - Only show if different */}
                {!kycUser.isSameResidentialAddress && (
                  <div>
                    <h5 className="font-bold text-black mb-2">Residential Address:</h5>
                    <div className="space-y-1 pl-2">
                      <div className="break-words">
                        <div><span className="font-semibold text-gray-700">Street:</span></div>
                        <div className="text-gray-600">{kycUser.residentialAddress}</div>
                      </div>
                      <div className="break-words">
                        <span className="font-semibold text-gray-700">District:</span> {kycUser.residentialDistrict}
                      </div>
                      <div className="break-words">
                        <span className="font-semibold text-gray-700">City:</span> {kycUser.residentialCity}
                      </div>
                      <div className="break-words">
                        <span className="font-semibold text-gray-700">Postal Code:</span> {kycUser.residentialPostalCode}
                      </div>
                      <div className="break-words">
                        <span className="font-semibold text-gray-700">Country:</span> {kycUser.residentialCountry}
                      </div>
                    </div>
                  </div>
                )}

                {kycUser.isSameResidentialAddress && (
                  <div className="text-gray-600 italic text-sm">
                    Residential address is the same as current address
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div>
          <button
            className="w-full cursor-pointer flex items-center justify-between py-4 text-left focus:outline-none"
            onClick={() => toggleSection("documents")}
          >
            <span className="text-gray-800 font-medium">Documents</span>
            {openSection === "documents" ? (
              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
            )}
          </button>

          {openSection === "documents" && (
            <div className="px-4 pb-4">
              <div className="space-y-4">
                {/* Passport Image */}
                <div>
                  <h5 className="font-bold text-black mb-2">Passport Image:</h5>
                  <div className="flex flex-col space-y-2">
                    {kycUser.passportImage ? (
                      <>
                        <div 
                          className="cursor-pointer border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow w-fit"
                          onClick={() => openImageModal(kycUser.passportImage, "Passport Image")}
                        >
                          <img 
                            src={kycUser.passportImage} 
                            alt="Passport" 
                            className="w-[100px] h-[70px] object-cover"
                          />
                        </div>
                        <span className="text-gray-700 text-xs">Click to view full size</span>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">Passport image not available</p>
                    )}
                  </div>
                </div>

                {/* Passport Selfie */}
                <div>
                  <h5 className="font-bold text-black mb-2">Passport Selfie:</h5>
                  <div className="flex flex-col space-y-2">
                    {kycUser.passportSelfie ? (
                      <>
                        <div 
                          className="cursor-pointer border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow w-fit"
                          onClick={() => openImageModal(kycUser.passportSelfie, "Passport Selfie")}
                        >
                          <img 
                            src={kycUser.passportSelfie} 
                            alt="Passport Selfie" 
                            className="w-[100px] h-[70px] object-cover"
                          />
                        </div>
                        <span className="text-gray-700 text-xs">Click to view full size</span>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">Passport selfie not available</p>
                    )}
                  </div>
                </div>

                {/* Digital Signature */}
                <div>
                  <h5 className="font-bold text-black mb-2">Digital Signature:</h5>
                  <div className="flex flex-col space-y-2">
                    {kycUser.digitalSignature ? (
                      <>
                        <div 
                          className="cursor-pointer border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow w-fit"
                          onClick={() => openImageModal(kycUser.digitalSignature, "Digital Signature")}
                        >
                          <img 
                            src={kycUser.digitalSignature} 
                            alt="Digital Signature" 
                            className="w-[100px] h-[70px] object-cover"
                          />
                        </div>
                        <span className="text-gray-700 text-xs">Click to view full size</span>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">Digital signature not available</p>
                    )}
                  </div>
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