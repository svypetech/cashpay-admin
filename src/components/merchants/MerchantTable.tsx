"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ColourfulBlock from "../ui/ColourfulBlock";
import MerchantInfoSidebar from "./MerchantInfoSidebar";
import Merchant from "@/src/Types/Merchant";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleBanUser from "@/src/hooks/users/banUser";
import { formatNumberToTwoDecimals } from "@/src/lib/functions";

interface MerchantsTableProps {
  headings: string[];
  merchants: Merchant[];
  onViewUser: (userId: string) => void;
}

export default function MerchantsTable({
  headings,
  merchants,
  onViewUser,
}: MerchantsTableProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(
    null
  );
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);


  useEffect(() => {
    // Adjust dropdown position
    if (activeDropdown !== null && tableRef.current && dropdownRefs.current[activeDropdown]) {
      const tableRect = tableRef.current.getBoundingClientRect()
      const dropdownRect = dropdownRefs.current[activeDropdown]!.getBoundingClientRect()
      const rowElement = dropdownRefs.current[activeDropdown]!.closest("tr")
      const rowRect = rowElement?.getBoundingClientRect()

      if (rowRect && dropdownRect) {
        const spaceBelow = tableRect.bottom - rowRect.bottom
        const dropdownHeight = dropdownRect.height

        // Always open dropdown downwards for the first row or single row
        if (activeDropdown === 0 || activeDropdown === 1 || activeDropdown === 2 || merchants.length === 1 || merchants.length === 2) {
          dropdownRefs.current[activeDropdown]!.style.top = "100%"
          dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
          dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
          dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
        } else {
          // For other rows with multiple rows, open upwards if not enough space below
          if (spaceBelow < dropdownHeight) {
            dropdownRefs.current[activeDropdown]!.style.bottom = "100%"
            dropdownRefs.current[activeDropdown]!.style.top = "auto"
            dropdownRefs.current[activeDropdown]!.style.marginBottom = "8px"
            dropdownRefs.current[activeDropdown]!.style.marginTop = "0"
          } else {
            // Open downwards
            dropdownRefs.current[activeDropdown]!.style.top = "100%"
            dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
            dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
            dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
          }
        }
      }
    }
  }, [activeDropdown, merchants.length])

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Add a function to handle viewing a merchant
  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowSidebar(true);
    setActiveDropdown(null);
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
        <table className="w-full text-left table-auto min-w-[700px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              <th className="p-2 sm:p-6 text-left font-[700] w-[12%]">
                {headings[0]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[15%]">
                {headings[1]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[23%]">
                {headings[2]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[20%]">
                {headings[3]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[20%]">
                {headings[4]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[10%]">
                {headings[5]}
              </th>
              <th className="p-2 sm:p-6 text-left font-[700] w-[10%]">
                {headings[6]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(merchants) &&
              merchants.map((merchant, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td className="p-2 sm:p-6 font-satoshi min-w-[100px] break-words whitespace-nowrap">
                    {merchant.userId}
                  </td>
                  <td className="p-2 sm:p-6 font-satoshi font-bold text-primary min-w-[120px] break-words whitespace-nowrap">
                    {merchant.name.firstName ? (`${merchant.name.firstName} ${merchant.name.lastName}`) : "N/A"}
                  </td>
                  <td className="p-2 sm:p-6 font-satoshi min-w-[150px] break-words whitespace-nowrap">
                    {merchant.email}
                  </td>
                  <td className="p-2 sm:p-6 font-satoshi min-w-[100px] whitespace-nowrap">
                    <p className="text-center" >{merchant.completedTrades}</p>
                  </td>
                  <td className="p-2 sm:p-6 font-satoshi min-w-[120px] whitespace-nowrap">
                    <p className="text-center" >{formatNumberToTwoDecimals(merchant.successRate)}%</p>
                  </td>
                  <td className="p-2 sm:p-6 font-satoshi min-w-[120px] py-[20px]">
                    <ColourfulBlock
                      text={merchant.verified ? "Verified" : "Pending"}
                      className={`text-left px-4 py-2 rounded-xl md:text-md font-semibold whitespace-nowrap ${merchant.verified
                          ? "bg-[#71FB5533] text-[#20C000]"
                          : "text-[#727272] bg-[#72727233]"
                        }`}
                    />
                  </td>
                  <td className="relative p-2 sm:p-6 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="z-70 absolute right-0 md:relative md:right-auto cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-4 h-4"
                        />
                      </button>

                      {activeDropdown === index && (
                        <div
                          className="absolute z-80 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-[700] cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                            onClick={() => {
                              handleViewMerchant(merchant);
                              setActiveDropdown(null);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm font-[700] text-red-600 cursor-pointer hover:bg-gray-50  border-b border-gray-200"
                            onClick={() => {
                              handleSuspendUser(merchant._id);
                              setActiveDropdown(null);
                            }}
                          >
                            Suspend User
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm font-[700] text-red-600 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              handleBanUser(merchant._id);
                              setActiveDropdown(null);
                            }}
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
      {/* Sidebar for merchant info */}
      {selectedMerchant && (
        <MerchantInfoSidebar
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
          merchant={selectedMerchant}
          onSuspend={() => handleSuspendUser(selectedMerchant._id)}
          onBan={() => handleBanUser(selectedMerchant._id)}
        />
      )}
    </div>
  );
}
