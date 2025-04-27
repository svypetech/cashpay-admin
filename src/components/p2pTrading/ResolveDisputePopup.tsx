"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface DisputeResolutionPopupProps {
    isOpen: boolean
    onClose: () => void
    disputeId: string | number
    onSubmit: (comments: string) => void
    isLoading?: boolean
}

export default function DisputeResolutionPopup({
    isOpen,
    onClose,
    disputeId,
    onSubmit,
    isLoading = false,
}: DisputeResolutionPopupProps) {
    const [comments, setComments] = useState("")

    // Reset comments when popup opens
    useEffect(() => {
        if (isOpen) {
            setComments("")
        }
    }, [isOpen])

    // Prevent body scrolling when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(comments)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 font-[satoshi]">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                {/* Header with close button */}
                <div className="mb-1 flex items-center justify-between">
                    <div></div>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold text-center mb-4">Resolve Dispute#{disputeId}</h2>
                    <div className="mb-6">
                        <label htmlFor="comments" className="mb-2 block text-base font-medium">
                            Write your comments
                        </label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Role Description"
                            className="h-48 w-full rounded-lg border border-gray-200 p-3 focus:border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-700"
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="min-w-[340px] rounded-md bg-primary py-3 text-center font-medium text-white transition-colors hover:bg-blue-900 disabled:bg-primary/50"
                        >
                            {isLoading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
