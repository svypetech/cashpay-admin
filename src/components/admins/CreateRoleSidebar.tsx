"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"

interface Permission {
    id: string
    label: string
    checked: boolean
}

interface CreateRoleSidebarProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { title: string; description: string; permissions: string[] }) => void
    isLoading?: boolean
}

export default function CreateRoleSidebar({ isOpen, onClose, onSubmit, isLoading = false }: CreateRoleSidebarProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [permissions, setPermissions] = useState<Permission[]>([
        { id: "view_transactions", label: "View Transactions", checked: true },
        { id: "approve_kyc", label: "Approve KYC", checked: false },
        { id: "resolve_disputes", label: "Resolve Disputes", checked: false },
        { id: "access_api_logs", label: "Access API Logs", checked: false },
        { id: "access_system_settings", label: "Access System Settings", checked: false },
    ])
    const [isVisible, setIsVisible] = useState(false)
    const [shouldSlideIn, setShouldSlideIn] = useState(false)

    const handlePermissionChange = (id: string) => {
        setPermissions(
            permissions.map((permission) =>
                permission.id === id ? { ...permission, checked: !permission.checked } : permission,
            ),
        )
    }

    const handleSubmit = () => {
        const selectedPermissions = permissions.filter((p) => p.checked).map((p) => p.id)
        onSubmit({
            title,
            description,
            permissions: selectedPermissions,
        })
    }

    // Handle animation and visibility states
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true) // Render the sidebar
            // Use a small timeout to ensure DOM is ready before starting animation
            setTimeout(() => {
                setShouldSlideIn(true) // Trigger slide-in animation
            }, 0)
            document.body.style.overflow = "hidden" // Prevent scrolling
        } else {
            setShouldSlideIn(false) // Start slide-out animation
            // Wait for animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setIsVisible(false)
                document.body.style.overflow = "auto" // Re-enable scrolling
            }, 300) // Match transition duration
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Clean up overflow style when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    if (!isVisible && !isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-[satoshi]">
            {/* Overlay with fade animation */}
            <div 
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${shouldSlideIn ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose} 
                aria-hidden="true" 
            />

            {/* Sidebar with slide animation */}
            <div 
                className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${shouldSlideIn ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-full flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-4 mt-5">
                        <h2 className="text-2xl font-semibold">Create a new Role</h2>
                        <button onClick={onClose} className="rounded-full cursor-pointer p-1 hover:bg-gray-100" aria-label="Close sidebar">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-4 px-8">
                        <div className="space-y-4">
                            {/* Role Title */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Role Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-2 focus:border-gray-700 focus:outline-none"
                                />
                            </div>

                            {/* Role Description */}
                            <div>
                                <textarea
                                    placeholder="Role Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-2 focus:border-gray-700 focus:outline-none"
                                ></textarea>
                            </div>

                            {/* Permissions */}
                            <div>
                                <h3 className="mb-3 font-semibold">Permissions</h3>
                                <div className="space-y-3">
                                    {permissions.map((permission) => (
                                        <label key={permission.id} className="flex items-center">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permission.checked}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-primary checked:bg-primary"
                                                />
                                                <Check
                                                    className={`absolute left-0.5 cursor-pointer top-0.5 h-4 w-4 text-white ${permission.checked ? "opacity-100" : "opacity-0"
                                                        }`}
                                                />
                                            </div>
                                            <span className="ml-3 text-gray-700">{permission.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 p-4 mx-14">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !title.trim()}
                            className="w-full rounded-md bg-primary py-2 font-medium text-white hover:bg-blue-900 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating..." : "Create Role"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}