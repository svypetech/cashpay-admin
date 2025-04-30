"use client"

import { useState } from "react"
import { X, Mail, Lock, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface Role {
    id: string
    name: string
}

interface AddAdminPopupProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { email: string; password: string; roleId: string }) => void
    isLoading?: boolean
}

export default function AddAdminPopup({ isOpen, onClose, onSubmit, isLoading = false }: AddAdminPopupProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [selectedRoleId, setSelectedRoleId] = useState("")
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

    const roles: Role[] = [
        { id: "super_admin", name: "Super Admin" },
        { id: "support_agent", name: "Support Agent" },
        { id: "financial_manager", name: "Financial Manager" },
    ]

    const handleSubmit = () => {
        onSubmit({
            email,
            password,
            roleId: selectedRoleId,
        })
    }

    const toggleRoleDropdown = () => {
        setIsRoleDropdownOpen(!isRoleDropdownOpen)
    }

    const selectRole = (roleId: string) => {
        setSelectedRoleId(roleId)
        setIsRoleDropdownOpen(false)
    }

    const getSelectedRoleName = () => {
        const role = roles.find((r) => r.id === selectedRoleId)
        return role ? role.name : "Role"
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 font-[satoshi]">
            <div className="sm:min-w-[600px] rounded-xl bg-white pt-10 pb-20 px-5 sm:px-20 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div></div>
                    <button
                        onClick={onClose}
                        className="rounded-full cursor-pointer p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-8 w-8 text-black" />
                    </button>
                </div>

                {/* Form */}
                <div className={`space-y-4 ${isRoleDropdownOpen ? 'pb-40' : ''}`}>
                    <h2 className="text-2xl text-center font-semibold text-gray-900 my-5">Add an Admin</h2>
                    {/* Email Input */}
                    <div className="relative min-w-[320px]">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image src={'/icons/email-icon.svg'} alt="Email Icon" height={20} width={20} />
                        </div>
                        <input
                            type="email"
                            placeholder="Enter e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-gray-200 py-3 pl-10 pr-3 text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Image src={'/icons/lock-icon.svg'} alt="Lock Icon" height={20} width={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="Give a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-gray-200 py-3 pl-10 pr-3 text-gray-700 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={toggleRoleDropdown}
                            className="flex w-full items-center justify-between rounded-md border-b border-gray-200 py-3 px-3 text-left text-gray-700"
                        >
                            <span>{getSelectedRoleName()}</span>
                            {isRoleDropdownOpen ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                        </button>

                        {isRoleDropdownOpen && (
                            <div className="absolute z-20 mt-1 w-full rounded-md bg-white max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => selectRole(role.id)}
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        {role.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !email || !password || !selectedRoleId}
                    className="mt-6 w-full rounded-xl bg-primary py-3 font-medium text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Sending..." : "Send Invite"}
                </button>
            </div>
        </div>
    )
}
