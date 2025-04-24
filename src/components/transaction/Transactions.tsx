"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import TransactionTable from "../tables/TransactionsTable";

const headings = ["ID", "From", "To", "Status", "Block#", "Date"];
const data = [
    {
      hash: "0x3a33151e6d5de02...c666",
      id: "0x9afca6...f684",
      from: "0xae0fb...2834f",
      to: "0xEb851...7B02C",
      status: "Completed",
      block: "#8422531",
      date: "2h ago"
    },
    {
      hash: "0x3a33151e6d5de02...c666",
      id: "0x9afca6...f685",
      from: "0xae0fb...2834f",
      to: "0xEb851...7B02C",
      status: "Pending",
      block: "#8422531",
      date: "2h ago"
    },
    {
      hash: "0x3a33151e6d5de02...c666",
      id: "0x9afca6...f686",
      from: "0xae0fb...2834f",
      to: "0xEb851...7B02C",
      status: "Completed",
      block: "#8422531",
      date: "2h ago"
    },
    {
      hash: "0x3a33151e6d5de02...c666",
      id: "0x9afca6...f687",
      from: "0xae0fb...2834f",
      to: "0xEb851...7B02C",
      status: "Failed",
      block: "#8422531",
      date: "2h ago"
    },
    {
      hash: "0x3a33151e6d5de02...c666",
      id: "0x9afca6...f688",
      from: "0xae0fb...2834f",
      to: "0xEb851...7B02C",
      status: "Completed",
      block: "#8422531",
      date: "2h ago"
    }
  ];  

  const navigationTabs = [
    { id: "all", title: "All" },
    { id: "completed", title: "Completed" },
    { id: "pending", title: "Pending" },
    { id: "failed", title: "Failed" },
  ];

export default function Transactions() {
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
    } else if (activeTab === "completed") {
      setFilteredData(data.filter((transaction) => transaction.status === "Completed"));
    } else if (activeTab === "pending") {
      setFilteredData(data.filter((transaction) => transaction.status === "Pending"));
    } else if (activeTab === "failed") {
        setFilteredData(data.filter((transaction) => transaction.status === "Failed"));
      }
  }, [activeTab]);

  useEffect(() => {
    const filtered = data.filter((transaction) => {
      const transactionFrom = transaction.from.toLowerCase();
      const transactionTo = transaction.to.toLowerCase();
      const transactionID = transaction.id.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        transactionFrom.includes(query) ||
        transactionTo.includes(query) ||
        transactionID.includes(query)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery]);

  return (
    <div>
      
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit">
            {navigationTabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-black ${activeTab === tab.id
                    ? "border-b-2 border-primary font-semibold"
                    : "hover:text-gray-700 cursor-pointer"
                    }`}
                >
                {tab.title}
                </button>
            ))}
        </div>
      </div>

      {/* Search and Actions */}
      <div className={`flex flex-col md:grid md:grid-cols-4 justify-between items-center mb-2 gap-4`}>
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
      <TransactionTable headings={headings} data={filteredData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
