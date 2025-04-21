"use client"

import Image from "next/image"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  isLoading?: boolean
  infoMessage?: string
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  isLoading = false,
  infoMessage,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-12">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500 cursor-pointer">
                <Image src="/icons/close.svg" alt="close button icon" width={20} height={20} className="h-4 w-4 hover:scale-105" />
          </button>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <p className="text-black mt-12 text-left">{message}</p>

        {infoMessage && <p className="text-xs text-red-500 mt-2 mb-8 text-center">{infoMessage}</p>}

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 border text-sm ${infoMessage? 'border-red-500 text-red-500 hover:bg-red-50' : 'text-primary border-primary hover:bg-blue-50'} rounded-md font-medium`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary text-sm text-white rounded-md hover:bg-blue-900 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  )
}
