"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Lock, Users, Trash2, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@news.com",
  })

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

  return (
    <div className="container mx-auto md:px-10 py-8 font-[satoshi]">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleEdit}
          className="cursor-pointer px-6 py-2 border font-bold border-primary rounded-md text-primary hover:bg-blue-50"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
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
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden">
                    <Image
                      src="/images/user-avatar.png"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <button className="text-white text-sm hover:underline">Change</button>
                      </div>
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
          <button className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left group">
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
              <Image src="/icons/lock-icon.svg" alt="Lock Icon" width={20} height={20} className="h-6 w-6" />
              </div>
              <span className="font-medium">Change password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <div className="border-t border-gray-100"></div>

          <button className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left hover:bg-gray-50 rounded-md group">
            <div className="flex items-center">
              <div className="mr-3 text-gray-400">
                <Image src="/icons/profile-2user.svg" alt="accounts" width={20} height={20} className="h-6 w-6" />
              </div>
              <span className="font-medium">Transfer Ownership</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <div className="border-t border-gray-100"></div>

          <button className="w-full cursor-pointer border-b border-gray-300 flex items-center justify-between py-3 px-1 text-left hover:bg-gray-50 rounded-md group">
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
    </div>
  )
}
