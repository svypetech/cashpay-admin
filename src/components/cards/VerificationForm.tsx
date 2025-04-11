"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface PersonalDetails {
  name: string
  dob: string
  nationality: string
}

interface Document {
  fileName: string
  fileType: string
}

interface VerificationAccordionProps {
  personalDetails?: PersonalDetails
  documents?: Document[]
  selfieDocument?: Document
}

export default function VerificationAccordion({
  personalDetails = {
    name: "John Doe",
    dob: "01-01-98",
    nationality: "Pakistan",
  },
  documents = [
    {
      fileName: "JohnDoe_ID.png",
      fileType: "png",
    },
  ],
  selfieDocument = {
    fileName: "selfie.png",
    fileType: "png",
  },
}: VerificationAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
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

        {openSection === "personal" && (
          <div className="px-6 pb-4">
            <div className="space-y-3">
              <div>
                <span className="font-bold text-black">Name:</span> {personalDetails.name}
              </div>
              <div>
                <span className="font-bold text-black">DOB:</span> {personalDetails.dob}
              </div>
              <div>
                <span className="font-bold text-black">Nationality:</span> {personalDetails.nationality}
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
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3 py-2">
                <Image src={`/icons/file-icon.svg`} alt="Document" width={40} height={40} className="rounded" />
                <span className="text-gray-700">{doc.fileName}</span>
              </div>
            ))}
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
            <div className="flex items-center space-x-3 py-2">
              <Image src={`/icons/file-icon.svg`} alt="Selfie" width={40} height={40} className="rounded" />
              <span className="text-gray-700">{selfieDocument.fileName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
