"use client"

import { useState, useMemo } from "react";
import UserTable from "../tables/UserTable";
import Pagination from "../pagination/pagination";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import SkeletonTableLoader from "@/src/components/skeletons/SkeletonTableLoader";
import useUser from "@/src/hooks/users/useUser";

const headings = [
  "User ID",
  "Name",
  "E-mail",
  "Joined date", 
  "Status",
  "Actions",
];

// Sort options
const sortOptions = [
  { label: "Date", value: "date" },
  { label: "Status", value: "userStatus"},
  
];

export default function UsersComponent() {
  // All states in one place
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("userStatus");
  
  const { users: allUsers, totalPages, isLoading, isError, setUsers } = useUser(currentPage, 10, sortBy);
  
  // Define tabs for the Tabs component
  const tabs = ["All", "Verified", "Pending Verifications"];
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort
  const handleSort = (value: string) => {
    setSortBy(value);
  };

  // Filter and sort users based on activeTab, searchTerm, and sortBy
  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];
    
    // First filter by tab
    let filtered = allUsers;
    
    if (activeTab === "Verified") {
      filtered = allUsers.filter(user => 
        user.verificationStatus === "Approved"
      );
    } else if (activeTab === "Pending Verifications") {
      filtered = allUsers.filter(user => 
        user.verificationStatus === "Pending" 
      );
    }
    
    // Then apply search filter if searchTerm exists
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        if(!user.name) return false; // Handle case where name is undefined
        let name = user.name.firstName + " " + user.name.lastName;
        return (
          name.toLowerCase().includes(search) || 
          user.email?.toLowerCase().includes(search) ||
          user._id?.toString().includes(search)
        );
      });
    }
    
    // Apply sorting
   
    
    return filtered;
  }, [allUsers, activeTab, searchTerm]);

  return (
    <>
      {/* Navigation Tabs - Using Tabs component */}
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        size="normal"
      />

      {/* Search and Actions */}
      <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 mt-4">
        {/* Search component */}
        <Search 
          className="w-full md:col-span-3" 
          onSearch={handleSearch} 
        />
        
        {/* Enhanced Sort component with options */}
        <Sort 
          className="w-full" 
          title="Sort by" 
          options={sortOptions}
          onSort={handleSort}
        />
      </div>

      {/* Content area */}
      {isLoading ? (
        <SkeletonTableLoader  headings={headings} rowCount={10}/>
      ) : isError ? (
        <div className="text-red-500 py-10 text-center">Error loading users</div>
      ) : (
        <div className="mt-4">
          <UserTable headings={headings} data={filteredUsers} setData={setUsers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}