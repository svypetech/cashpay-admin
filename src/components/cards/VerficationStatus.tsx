"use client"
import { Check } from "lucide-react"
import Image from "next/image"

interface VerificationStep {
  title: string
  completed: boolean
  active?: boolean
}

interface VerificationStepsProps {
  steps?: VerificationStep[]
  onStartVerification?: () => void
}

export default function VerificationSteps({
  steps = [
    { title: "Personal Details", completed: true },
    { title: "Documents", completed: false },
    { title: "Selfie", completed: false },
  ],
  onStartVerification = () => console.log("Start verification"),
}: VerificationStepsProps) {
  return (
    <div className="w-full max-w-md mx-auto font-[satoshi] mb-15">
      <div className="space-y-0">
        {steps.map((step, index) => (
          <div key={index}>
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-700 text-sm">{step.title}</span>
              <Image src={`${step.completed ? "/icons/checkbox.svg" : "/icons/pending-checkbox.svg"}`} alt="Profile" width={20} height={20} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={onStartVerification}
          className="bg-primary hover:bg-blue-900 cursor-pointer text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Start Verification
        </button>
      </div>
    </div>
  )
}
