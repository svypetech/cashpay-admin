"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import ListingTable from "@/src/components/tables/ListingsTable";

const headings = ["Listing ID", "Seller ID", "Buyer ID", "Type", "Currency", "Status", "Actions"];
  
  const data = [
    {
      listingID: "IDMCPL-9203",
      sellerID: "IDHCP-9000",
      buyerID: "IDHCP-5603",
      type: "Sell",
      currency: "BTC",
      status: "active"
    },
    {
      listingID: "IDMCPL-9203",
      sellerID: "IDHCP-9000",
      buyerID: "IDHCP-0603",
      type: "Sell",
      currency: "BTC",
      status: "active"
    },
    {
      listingID: "IDMCPL-9203",
      sellerID: "IDHCP-9000",
      buyerID: "IDHCP-0603",
      type: "Sell",
      currency: "BTC",
      status: "active"
    },
    {
      listingID: "IDMCPL-9203",
      sellerID: "IDHCP-9000",
      buyerID: "IDHCP-5603",
      type: "Sell",
      currency: "BTC",
      status: "active"
    },
    {
      listingID: "IDMCPL-9203",
      sellerID: "IDHCP-9000",
      buyerID: "IDHCP-0603",
      type: "Sell",
      currency: "BTC",
      status: "inactive"
    }
  ];
   

  const navigationTabs = [
    { id: "all", title: "All" },
    { id: "active", title: "Active" },
    { id: "inactive", title: "InActive" },
  ];

export default function P2PListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredlistings, setFilteredListings] = useState(data);
  const [totalPages, setTotalPages] = useState(15); // Assuming you have a total pages state
//   const { listings, totalPages, loading } = useFetchlistings(currentPage, 10); 
//   const [filteredlistings, setFilteredListings] = useState<listing[]>(listings);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // filter based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredListings(data);
    } else if (activeTab === "active") {
      setFilteredListings(data.filter((listing) => listing.status === "active"));
    } else if (activeTab === "inactive") {
      setFilteredListings(data.filter((listing) => listing.status === "inactive"));      
    }
  }, [activeTab]);

  useEffect(() => {
    const filtered = data.filter((listing) => {
      const listingFrom = listing.sellerID.toLowerCase();
      const listingTo = listing.buyerID.toLowerCase();
      const listingID = listing.listingID.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        listingFrom.includes(query) ||
        listingTo.includes(query) ||
        listingID.includes(query)
      );
    });
    setFilteredListings(filtered);
  }, [searchQuery]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

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
      <ListingTable headings={headings} data={filteredlistings} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
