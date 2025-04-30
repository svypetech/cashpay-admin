"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import TransferOwnershipDialog from "@/src/components/cards/TransferOwnershipDialog"
import DeleteAccountDialog from "@/src/components/cards/DeleteAccount"

export default function SettingsPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@news.com",
  })
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = () => {
    if (isEditing) {
      // Save changes logic would go here
      console.log("Saving changes:", formData)
    }
    setIsEditing(!isEditing)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTransferOwnership = (newOwnerEmail: string) => {
    setIsSubmitting(true)
    // Simulate API call
    console.log("Transferring ownership to:", newOwnerEmail)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowTransferDialog(false)
      // alert(`Ownership transferred to ${newOwnerEmail}`)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-10 py-8 font-[satoshi]">
      <div className={`flex ${isEditing? "flex-col" : ""} sm:flex-row sm:items-center justify-between mb-4`}>
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Settings</h1>

        {isEditing ? (
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 sm:flex-none cursor-pointer px-4 py-1.5 border font-semibold border-primary rounded-md text-primary hover:bg-blue-50 text-sm sm:text-base"
            >
              Discard
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 sm:flex-none cursor-pointer px-4 py-1.5 border font-semibold border-primary rounded-md text-white bg-primary hover:bg-blue-900 text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="cursor-pointer px-4 py-1.5 border font-semibold border-primary rounded-md text-primary hover:bg-blue-50 text-sm sm:text-base"
          >
            Edit
          </button>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-8">Manage your account settings and preferences</p>

      <div className="border-t border-gray-200 pt-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Account Information - 1 column */}
          <div className="mx-10 md:mx-0 md:col-span-1">
            <h2 className="text-lg font-semibold mb-1">Account Information</h2>
            <p className="text-gray-500 text-sm">Set your account details</p>
          </div>

          {/* Profile Photo and Input Fields - 3 columns */}
          <div className="md:col-span-3 mx-10">
            <div className="flex flex-col gap-6">
              {/* Profile Photo - 1 column within the 3 columns */}
              <div className="md:col-span-1">
                <div className="flex flex-col ">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Profile Photo</h3>
                  <div className="relative w-36 h-36 overflow-hidden p-2">
                    <Image
                      src={"/images/user-avatar.png"}
                      alt={"user avatar"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full rounded-full"
                    />
                    {isEditing && (
                      <button
                        onClick={() => console.log("Edit profile picture")}
                        className="z-10 absolute top-0 right-0 p-1.5 rounded-full hover:scale-105 cursor-pointer transition-colors"
                        aria-label="Edit profile picture"
                      >
                        <Image
                          src={"/icons/edit.svg"}
                          alt={"user avatar"}
                          width={22}
                          height={22}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Fields - 3 columns within the 3 columns */}
              <div className="md:col-span-3">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">
          <Link href={"/change-password"} className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left group">
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <Image src="/icons/lock-icon.svg" alt="Lock Icon" width={20} height={20} className="h-6 w-6" />
              </div>
              <span className="font-medium">Change password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </Link>

          <div className="border-t border-gray-100"></div>

          <button 
          onClick={() => setShowTransferDialog(true)}
          className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left rounded-md group">
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <Image src="/icons/profile-2user.svg" alt="accounts" width={20} height={20} className="h-6 w-6" />
              </div>
              <span className="font-medium">Transfer Ownership</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <div className="border-t border-gray-100"></div>

          <button onClick={() => setShowDeleteDialog(true)} className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left hover:bg-gray-50 rounded-md group">
            <div className="flex items-center">
              <div className="mr-3 text-red-500">
                <Image src="/icons/trash-can.svg" alt="Delete" width={20} height={20} className="h-5 w-5" />
              </div>
              <span className="font-medium text-red-500">Delete Account</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Transfer Ownership Dialog */}
      <TransferOwnershipDialog
        isOpen={showTransferDialog}
        onCancel={() => setShowTransferDialog(false)}
        onConfirm={handleTransferOwnership}
        isLoading={isSubmitting}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountDialog  
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Confirm Account Deletion"
        message="Are you sure you want to delete your account?"
        warningText="*This operation cannot be undone."
        cancelText="Cancel"
        confirmText="Confirm Deletion"
        onConfirm={() => {
          console.log("Account deleted")
          setShowDeleteDialog(false)
        }}
      />
    </div>
  )
}
