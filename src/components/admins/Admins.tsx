"use client";

import { use, useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import AdminTable from "../tables/AdminTable";
import CreateRoleSidebar from "./CreateRoleSidebar";
import { Plus } from "lucide-react";
import Image from "next/image";
import AddAdminPopup from "./CreateAdmin";

const headings = ["ID", "Name", "E-mail", "Joined date", "Status", "Role", "Actions"];

export default function Admins() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [roles, setRoles] = useState([
    { id: "0", title: "All", description: "All admins" },
    { id: "1", title: "Super Admin", description: "Full access to all features" },
    { id: "2", title: "Support Agent", description: "Can only view data" },
    { id: "3", title: "Financial Manager", description: "Can manage users and transactions" },
  ])
  const [admins, setAdmins] = useState([
    {
      id: "ID#CP-9203",
      name: "John Doe",
      email: "johndoe@gmail.com",
      joinedDate: "18-03-25",
      status: "+93 2328238902",
      role: "Super Admin"
    },
    {
      id: "ID#CP-9204",
      name: "Jane Smith",
      email: "janesmith@gmail.com",
      joinedDate: "18-03-25",
      status: "+93 2328238902",
      role: "Support Agent"
    },
    {
      id: "ID#CP-9205",
      name: "Alice Johnson",
      email: "alicejohnson@gmail.com",
      joinedDate: "18-03-25",
      status: "+93 2328238902",
      role: "Financial Manager"
    },
    {
      id: "ID#CP-9206",
      name: "Bob Wilson",
      email: "bobwilson@gmail.com",
      joinedDate: "18-03-25",
      status: "+93 2328238902",
      role: "Support Agent"
    },
    {
      id: "ID#CP-9207",
      name: "Carol Brown",
      email: "carolbrown@gmail.com",
      joinedDate: "18-03-25",
      status: "+93 2328238902",
      role: "Financial Manager"
    }
  ])
  const [filteredData, setFilteredData] = useState(admins)

  useEffect(() => {
    setFilteredData(admins.filter((user) => {
      if (activeTab === "all") return true;
      return user.role.toLowerCase() === activeTab.toLowerCase();
    }))
  }, [activeTab, admins])

  useEffect(() => {
    setFilteredData(admins.filter((user) => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
    }))
  }, [searchQuery, admins])

  const handleAddAdmin = async (data: { email: string; password: string; roleId: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Adding admin:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Map role ID to role name
      const roleMap = {
        super_admin: "Super Admin",
        support_agent: "Support Agent",
        financial_manager: "Financial Manager",
      }

      // Add new admin to the list
      const newAdmin = {
        id: (admins.length + 1).toString(),
        email: data.email,
        role: roleMap[data.roleId as keyof typeof roleMap],
        name: data.email.split("@")[0], // Example name from email
        joinedDate: new Date().toLocaleDateString("en-GB"),
        status: "+93 2328238902", // Example phone number
        profile: "/images/user-avatar.png", // Example profile image
      }
      setAdmins([...admins, newAdmin])

      // Close popup
      setIsPopupOpen(false)
    } catch (error) {
      console.error("Error adding admin:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRole = async (data: { title: string; description: string; permissions: string[] }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Creating role:", data)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new role to the list
      const newRole = {
        id: (roles.length + 1).toString(),
        title: data.title,
        description: data.description,
      }
      setRoles([...roles, newRole])

      // Close sidebar
      setIsSidebarOpen(false)
    } catch (error) {
      console.error("Error creating role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>

      
      {/* Navigation Tabs */}
      <div className="px-10 w-full flex items-center mb-4">
        <div className="flex w-fit">
          {/* mapping roles using name */}
          {roles.map((role) => (
            role.title != "Super Admin" &&
            <button
              key={role.id}
              onClick={() => setActiveTab(role.title.toLowerCase())}
              className={`px-4 py-2 text-black ${activeTab === role.title.toLowerCase()
                ? "border-b-2 border-primary font-bold"
                : "hover:text-gray-700 cursor-pointer"
                }`}
            >
              {role.title}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Actions */}
      <div className={`flex flex-col md:grid md:grid-cols-8 justify-between items-center mb-2 gap-4 md:px-10`}>
        <div className={`relative w-full md:w-auto md:col-span-3`}>
          <div className="relative">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Image src="/icons/search.svg" alt="Arrow right" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-4 w-full font-[satoshi] md:col-span-2`}>
          <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            <span>Sort by</span>
            <Image src="/icons/dropdownIcon.svg" alt="Arrow right" width={24} height={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:col-span-3 font-[satoshi]">
          <button onClick={() => setIsPopupOpen(true)} className={`w-[50%] cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0`}>
            <span>Add Admin</span>
            <Plus className="h-6 w-6 text-primary" />
          </button>

          <button onClick={() => setIsSidebarOpen(true)} className={`w-[50%] cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border bg-primary rounded-lg text-white hover:bg-blue-900 ml-auto md:ml-0`}>
            <span>Create a new Role</span>            
          </button>
        </div>
      </div>

      <AdminTable headings={headings} data={filteredData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <CreateRoleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleCreateRole}
        isLoading={isLoading}
      />

      <AddAdminPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleAddAdmin}
        isLoading={isLoading}
      />
    </div>
  );
}
