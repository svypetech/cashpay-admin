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
import Error from "../ui/Error";
import Tabs from "../ui/Tabs";
import { get } from "http";
import Search from "../ui/Search";
import { useToast } from "@/src/lib/ToastProvider";

const headings = ["ID", "Name", "E-mail", "Joined date", "Role", "Actions"];
// Sort options
const sortOptions = [
  { label: "Date", value: "date" },
  { label: "Title", value: "title" },
  { label: "None", value: "" },
];

const getStatusFromTab = (tab: string) => {
  switch (tab) {
    case "Financial Manager":
      return "financial manager";
    case "Support Agent":
      return "support agent";
    default:
      return undefined; // "All" case - no status filter
  }
};

export default function Admins() {
  const { showSuccess, showError } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const tabs = ["All", "Financial Manager", "Support Agent"];
  const [sortBy, setSortBy] = useState(""); // Default sort option
  const {
    admins,
    isLoading: loadingAdmins,
    error,
    totalPages,
  } = useGetAdmins(currentPage, 10, sortBy, getStatusFromTab(activeTab), searchQuery);
  const [filteredData, setFilteredData] = useState(admins);

  useEffect(() => {
    // Reset to first page when search or sort changes
    setCurrentPage(1);
  }, [sortBy, activeTab, searchQuery]);

  useEffect(() => {
    setFilteredData(admins);
  }, [searchQuery, admins]);


  // Handle sort
  const handleSort = (value: string) => {
    setSortBy(value);
    console.log("Sorting by:", value);
  };

  const handleAddAdmin = async (data: {
    email: string;
    password: string;
    roleId: string;
  }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      console.log("Adding admin:", data);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`,
        {
          email: data.email,
          password: data.password,
          role: data.roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", res.data);
      if (res.data.success) {
        showSuccess("Admin added successfully");
      } else {
        showError("Failed to add admin");
      }
    } catch (error) {
      showError("Failed to add admin");
      console.error("Error adding admin:", error);
    } finally {
      setIsLoading(false);
      setIsPopupOpen(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Navigation Tabs */}
      {/* Navigation Tabs - Using Tabs component */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        size="normal"
      />

      {/* Search and Actions */}
      <div
        className={`flex flex-col md:grid md:grid-cols-8 justify-between items-center mb-2 gap-4 mt-4`}
      >
        <Search className="w-full md:col-span-4" onSearch={handleSearch} />
        {/* <div className={`relative w-full md:w-auto md:col-span-3`}> */}
          

        <Sort
          className="w-full md:md:col-span-2"
          title="Sort by"
          options={sortOptions}
          onSort={handleSort}
        />

        <div className="flex items-center gap-4 w-full md:col-span-2 font-[satoshi]">
          <button
            onClick={() => setIsPopupOpen(true)}
            className={`w-full cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0`}
          >
            <span>Add Admin</span>
            <Plus className="h-6 w-6 text-primary" />
          </button>

          {/* <button onClick={() => setIsSidebarOpen(true)} className={`w-[50%] cursor-pointer flex justify-center items-center gap-2 px-4 py-2 font-bold border bg-primary rounded-lg text-white hover:bg-blue-900 ml-auto md:ml-0`}>
            <span>Create a new Role</span>
          </button> */}
        </div>
      </div>
      {loadingAdmins ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : error ? (
        <Error text="Something went wrong." />
      ) : admins.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div>
          <AdminTable headings={headings} data={admins} setData={setFilteredData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
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
