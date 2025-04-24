"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import WalletTable from "@/src/components/tables/WalletTable";

const headings = ["User ID", "Name", "Card User", "Crypto Holdings", "Total Balance (USDT)", "Actions"];
const data = [
    {
      userId: "ID#CP-9203",
      name: "John Doe",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "Jane Smith",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "Jack Sparrow",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "Daniel Bryan",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "John Wick",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "Arslan Khan",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    },
    {
      userId: "ID#CP-9203",
      name: "Lionel Messi",
      cardUser: true,
      cryptoHoldings: 5,
      totalBalance: 1700.00,
      actions: ["View Wallet", "Ban User", "Suspend User"]
    }
  ];

export default function Wallet() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(15); // Example total pages
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filtered = data.filter((user) => {
        return (
            user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.totalBalance.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
    setFilteredData(filtered);
  }, [searchQuery]);

  return (
    <div>
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
      <WalletTable headings={headings} data={filteredData} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
