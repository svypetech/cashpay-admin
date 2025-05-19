"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import AdminTable from "../tables/AdminTable";
import CreateRoleSidebar from "./CreateRoleSidebar";
import { Plus } from "lucide-react";
import Image from "next/image";
import AddAdminPopup from "./CreateAdmin";
import useGetAdmins from "@/src/hooks/admins/getAdmins";
import axios from "axios";
import Sort from "../ui/Sort";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

const headings = ["ID", "Name", "E-mail", "Joined date", "Role", "Actions"];
// Sort options
const sortOptions = [
  { label: "Date", value: "date" },
  { label: "Title", value: "title"},
];

export default function Admins() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("") // Default sort option
  const { admins, isLoading: loadingAdmins, error, totalPages } = useGetAdmins(currentPage, 10, sortBy)
  const [filteredData, setFilteredData] = useState(admins)
  const [roles, setRoles] = useState([
    { id: "0", title: "All", description: "All admins" },
    { id: "1", title: "Super Admin", description: "Full access to all features" },
    { id: "2", title: "Support Agent", description: "Can only view data" },
    { id: "3", title: "Financial Manager", description: "Can manage users and transactions" },
  ])

  // Apply filters and sort when dependencies change
  useEffect(() => {
    // First, filter by tab
    let result = admins.filter((user) => {
      if (activeTab === "all") return true;
      return user.role.toLowerCase() === activeTab.toLowerCase();
    });

    // Then, filter by search query
    if (searchQuery.trim()) {
      result = result.filter((user) => {
        // Check if email exists before calling toLowerCase
        const email = user.email ? user.email.toLowerCase() : '';
        return email.includes(searchQuery.toLowerCase());
      });
    }

    // Finally, apply sorting
    if (sortBy) {
      result = [...result].sort((a, b) => {
        if (sortBy === "date_desc") {
          // Sort by date descending (newest first)
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        } else if (sortBy === "date_asc") {
          // Sort by date ascending (oldest first)
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        }
        return 0;
      });
    }

    setFilteredData(result);
  }, [activeTab, admins, searchQuery, sortBy]);

  // Handle sort
  const handleSort = (value: string) => {
    setSortBy(value);
    console.log("Sorting by:", value);
  };

  const handleAddAdmin = async (data: { email: string; password: string; roleId: string }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Adding admin:", data)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
        email: data.email,
        password: data.password,
        role: data.roleId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      console.log("Response:", res.data)
      if(res.data.success) {
        alert("Admin added successfully")
      } else {
        alert("Failed to add admin")
      }
    } catch (error) {
      alert("Failed to add admin")
      console.error("Error adding admin:", error)
    } finally {
      setIsLoading(false)
      setIsPopupOpen(false)
    }
  }

  const handleCreateRole = async (data: { title: string; description: string; permissions: string[] }) => {
    setIsLoading(true)
    try {
      // Simulate API call
      console.log("Creating role:", data)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
        title: data.title,
        description: data.description,
        canViewTransactions: data.permissions.includes("view_transactions"),
        canApproveKyc: data.permissions.includes("approve_kyc"),
        canResolveDispute: data.permissions.includes("resolve_disputes"),
        canAccessApiLogs: data.permissions.includes("access_api_logs"),
        canAccessSystemSettings: data.permissions.includes("access_system_settings"),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      console.log("Response:", res.data)

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
      <div className={`flex flex-col md:grid md:grid-cols-8 justify-between items-center mb-2 gap-4`}>
        <div className={`relative w-full md:w-auto md:col-span-3`}>
          <div className="relative">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
            </div>
          </div>
        </div>

        <Sort
          className="w-full md:md:col-span-2"
          title="Sort by"
          options={sortOptions}
          onSort={handleSort}
        />

        <div className="flex items-center gap-4 w-full md:col-span-3 font-[satoshi]">
          <button onClick={() => setIsPopupOpen(true)} className={`w-full cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0`}>
            <span>Add Admin</span>
            <Plus className="h-6 w-6 text-primary" />
          </button>

          {/* <button onClick={() => setIsSidebarOpen(true)} className={`w-[50%] cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border bg-primary rounded-lg text-white hover:bg-blue-900 ml-auto md:ml-0`}>
            <span>Create a new Role</span>
          </button> */}
        </div>
      </div>
      {loadingAdmins ? (
        <SkeletonTableLoader  headings={headings} rowCount={10}/>
      ) : error ? (
        <div className="text-red-500 py-10 text-center">Error loading users</div>
      ) : (
        <div>
          {filteredData.length > 0 ? (
            <>
              <AdminTable headings={headings} data={filteredData} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">No admins found</div>
          )}
        </div>
      )}

      {/* <CreateRoleSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSubmit={handleCreateRole}
        isLoading={isLoading}
      /> */}

      <AddAdminPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleAddAdmin}
        isLoading={isLoading}
      />
    </div>
  );
}