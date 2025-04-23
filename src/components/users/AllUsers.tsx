"use client";

import { use, useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import UserTable from "../tables/UserTable";
import Image from "next/image";

const headings = [
  "User ID",
  "Name",
  "E-mail",
  "Joined date",
  "Status",
  "Actions",
];

const data = [
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "Jane Smith",
    email: "jane@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "Justin Timberlake",
    email: "justin@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "Pedri Gonzalez",
    email: "pedri@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Pending",
    profile: "/images/user-avatar.png",
  },
  {
    id: "ID#CP-9203",
    name: "John Doe",
    email: "johndoe@gmail.com",
    joinedDate: "18-03-25",
    status: "Verified",
    profile: "/images/user-avatar.png",
  },
];

export default function AllUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // filter based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredData(data);
    } else if (activeTab === "verified") {
      setFilteredData(data.filter((user) => user.status === "Verified"));
    } else if (activeTab === "pending") {
      setFilteredData(data.filter((user) => user.status === "Pending"));
    }
  }, [activeTab]);

  useEffect(() => {
    const filtered = data.filter((user) => {
      const userName = user.name.toLowerCase();
      const userEmail = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        userName.includes(query) ||
        userEmail.includes(query) ||
        user.id.includes(query)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery]);

  return (
    <div>
      
      {/* Navigation Tabs */}
      <div className="px-10 w-full flex items-center mb-4">
        <div className="flex w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-black ${activeTab === "all"
              ? "border-b-2 border-primary font-bold"
              : "hover:text-gray-700 cursor-pointer"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-4 py-2 ${activeTab === "verified" || activeTab === "support agent"
              ? "border-b-2 border-primary font-bold"
              : "hover:text-gray-700 cursor-pointer"
              }`}
          >
            Verified
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 ${activeTab === "pending" || activeTab === "financial manager"
              ? "border-b-2 border-primary font-bold"
              : "hover:text-gray-700 cursor-pointer"
              }`}
          >
            Pending Verifications
          </button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className={`flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4 md:px-10`}>
        <div className={`relative w-full md:w-auto md:col-span-3`}>
          <div className="relative">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:gray-700 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Image src="/icons/search.svg" alt="Arrow right" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-4 w-full font-[satoshi] md:col-span-1`}>
          <button className="w-full flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            <span>Sort by</span>
            <Image src="/icons/dropdownIcon.svg" alt="Arrow right" width={24} height={24} />
          </button>
        </div>

      </div>
      <UserTable headings={headings} data={filteredData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
