"use client"

import { useState, useMemo } from "react";
import Pagination from "../pagination/pagination";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import MerchantsTable from "./MerchantTable";

// Table headings
const headings = [
  "User ID",
  "Name",
  "E-mail",
  "Trades Completed",
  "Success Rate", 
  "Status",
  "Actions",
];

// Sort options
const sortOptions = [
  { label: "Date (Newest)", value: "date_desc" },
  { label: "Date (Oldest)", value: "date_asc" },
  { label: "Success Rate (High-Low)", value: "success_desc" },
  { label: "Success Rate (Low-High)", value: "success_asc" },
];

// Mock data based on the image
const mockMerchants = [
  {
    userId: "IDCP-0023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    tradesCompleted: 200,
    successRate: "92%",
    status: "Verified"
  },
  {
    userId: "IDCP-0023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    tradesCompleted: 200,
    successRate: "92%",
    status: "Verified"
  },
  {
    userId: "IDCP-0023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    tradesCompleted: 200,
    successRate: "92%",
    status: "Pending"
  },
  {
    userId: "IDCP-0023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    tradesCompleted: 200,
    successRate: "92%",
    status: "Verified"
  },
  {
    userId: "IDCP-0023",
    name: "John Doe",
    email: "johndoe@gmail.com",
    tradesCompleted: 200,
    successRate: "92%",
    status: "Verified"
  }
];

export default function MerchantsComponent() {
  // All states in one place
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  // Mock total pages
  const totalPages = 13; // From the screenshot showing page numbers
  
  
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

  // User action handlers
  const handleViewUser = (userId: string) => {
    console.log(`View user ${userId}`);
  };

  const handleSuspendUser = (userId: string) => {
    console.log(`Suspend user ${userId}`);
  };

  const handleBanUser = (userId: string) => {
    console.log(`Ban user ${userId}`);
  };

  // Filter and sort merchants based on activeTab, searchTerm, and sortBy
  const filteredMerchants = useMemo(() => {
    // First filter by tab
    let filtered = [...mockMerchants];
    
    if (activeTab === "Verified") {
      filtered = mockMerchants.filter(merchant => merchant.status === "Verified");
    } else if (activeTab === "Pending Verifications") {
      filtered = mockMerchants.filter(merchant => merchant.status === "Pending");
    }
    
    // Then apply search filter if searchTerm exists
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(merchant => 
        merchant.name.toLowerCase().includes(search) || 
        merchant.email.toLowerCase().includes(search) ||
        merchant.userId.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "date_desc":
            return b.userId.localeCompare(a.userId);
          case "date_asc":
            return a.userId.localeCompare(b.userId);
          case "success_desc":
            return parseInt(b.successRate) - parseInt(a.successRate);
          case "success_asc":
            return parseInt(a.successRate) - parseInt(b.successRate);
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [mockMerchants, activeTab, searchTerm, sortBy]);

  return (
    <>
      {/* Navigation Tabs */}
      <Tabs 
        tabs={["All", "Verified", "Pending Verifications"]}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        size="normal"
      />

      {/* Search and Actions */}
      <div className="flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 mt-4">
        <Search 
          className="w-full md:col-span-3" 
          onSearch={handleSearch} 
        />
        
        <Sort 
          className="w-full" 
          title="Sort by" 
          options={sortOptions}
          onSort={handleSort}
        />
      </div>

      {/* Content area with separated table component */}
      <div className="mt-4">
        <MerchantsTable
          headings={headings}
          merchants={filteredMerchants}
          onViewUser={handleViewUser}
          onSuspendUser={handleSuspendUser}
          onBanUser={handleBanUser}
        />
        
        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
