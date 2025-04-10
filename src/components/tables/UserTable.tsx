"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"
import UserProfileSidebar from "../users/UserInfoSidebar"
import Image from "next/image"

interface User {
  id: string
  name: string
  email: string
  joinedDate: string
  status: string
  profile: string
}

interface Props {
  headings: string[]
  data: User[]
}

const UserTable: React.FC<Props> = ({ data, headings }) => {
  const { darkMode } = useDarkMode() // Get dark mode state
  const [showDark, setShowDark] = useState(darkMode)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [showUserSidebar, setShowUserSidebar] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    // Delay state update slightly to enable smooth transition
    const timeout = setTimeout(() => setShowDark(darkMode), 100)
    return () => clearTimeout(timeout)
  }, [darkMode])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const target = event.target as HTMLElement
        if (!target.closest(".dropdown-container")) {
          setActiveDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowUserSidebar(true)
    setActiveDropdown(null)
  }

  const handleSuspendUser = (user: User) => {
    // Implement suspend user functionality
    console.log("Suspend user:", user)
    setActiveDropdown(null)
  }

  const handleBanUser = (user: User) => {
    // Implement ban user functionality
    console.log("Ban user:", user)
    setActiveDropdown(null)
  }

  return (
    <div className={`flex-1 rounded-lg w-full sm:px-10 py-5`}>
      {/* Table */}
      <div className="rounded-lg overflow-hidden w-full">
        <table className="w-full text-left table-fixed min-w-30">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
              {headings.map((heading, index) => (
                <th key={index} className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr key={index} className="border-b text-[12px] sm:text-[16px]">
                  <td className={`p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words`}>{user.id}</td>
                  <td className={`p-2 sm:p-4 font-satoshi font-bold text-primary w-3/6 min-w-0 break-words`}>
                    {user.name}
                  </td>
                  <td className="p-2 sm:p-4 font-satoshi w-2/6 min-w-0 break-words">{user.email}</td>
                  <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0">{user.joinedDate}</td>
                  <td className="p-2 sm:p-4 font-satoshi w-1/6 min-w-0 ">
                    {user.status === "Verified" ? (
                      <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-2 rounded-xl text-xs md:text-md font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[#727272] bg-[#72727233] px-4 py-2 rounded-xl font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="relative p-2 sm:p-4 font-satoshi w-1/6 min-w-0">
                    <div className="dropdown-container relative">
                      <button
                        className="absolute md:relative md:right-auto right-0 cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image src="/icons/options.svg" alt="Options" width={24} height={24} className="w-4 h-4" />
                      </button>

                      {activeDropdown === index && (
                        <div className="absolute z-10 right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleViewUser(user)}
                          >
                            View
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSuspendUser(user)}
                          >
                            Suspend User
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleBanUser(user)}
                          >
                            Ban User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* User Profile Sidebar */}
      {selectedUser && (
        <UserProfileSidebar
          showSidebar={showUserSidebar}
          onClose={() => setShowUserSidebar(false)}
          user={{
            id: selectedUser.id,
            profileImage: selectedUser.profile || "/images/user-avatar.png",
            name: selectedUser.name,
            email: selectedUser.email,
            joiningDate: selectedUser.joinedDate,
            isVerified: selectedUser.status === "Verified",
          }}
        />
      )}
    </div>
  )
}

export default UserTable
