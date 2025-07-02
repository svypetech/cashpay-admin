"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ColourfulBlock from "../ui/ColourfulBlock";
import ExpandableId from "../ui/ExpandableId";
import ConfirmModal from "../ui/ConfirmModal";
import axios from "axios";
import { Listing } from "@/src/Types/P2PListing";
import ListingDetailsPopup from "../p2pTrading/ListingPopup";

interface Props {
  headings: string[];
  data: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

const ListingsTable: React.FC<Props> = ({ data, headings }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing>(
    {} as Listing
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetListingId, setTargetListingId] = useState<string>("");

  // Add needsPadding logic
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 2 || data.length <= 2);

  // Simple dropdown logic: close on outside click
  useEffect(() => {
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

  const toggleDropdown = (index: number) => {
    setSelectedIndex(index); // Set selected index first
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleDeleteClick = (listing: Listing) => {
    setTargetListingId(listing.id);

    setShowConfirmModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteListing = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/add/${targetListingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        alert("listing deleted successfully");
      } else {
        alert("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting listing");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setTargetListingId("");
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowConfirmModal(false);
      setTargetListingId("");
    }
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add conditional padding bottom for dropdown space */}
      <div
        className={`rounded-lg overflow-x-auto w-full ${
          needsPadding ? "pb-28" : ""
        }`}
        ref={tableRef}
      >
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              <th className="p-4 sm:p-4 text-left font-[700] w-[15%]">
                {headings[0]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[20%]">
                {headings[1]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[15%]">
                {headings[2]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[20%]">
                {headings[3]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[20%]">
                {headings[4]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[10%]">
                {headings[5]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((listing, index) => (
                <tr
                  key={listing.id}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <ExpandableId id={listing.id} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <ExpandableId id={listing.createdBy} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {listing.type}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {listing.currency}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <ColourfulBlock
                      text={listing.addVisibility ? "Active" : "Inactive"}
                      className={
                        listing.addVisibility
                          ? "bg-[#71FB5533] text-[#20C000]"
                          : "bg-[#FF000033] text-[#FF0000]"
                      }
                    />
                  </td>
                  <td className="relative px-2 sm:px-4 py-3 sm:py-4 font-satoshi text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="flex items-center justify-center w-[80%] xl:w-[70%] 2xl:w-[40%] lg:w-[100%] cursor-pointer"
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
                          className="absolute z-10 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowPopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            View Details
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleDeleteClick(listing)}
                          >
                            Delete Listing
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

      <ListingDetailsPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        listing={selectedListing}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteListing}
        title="Delete Listing"
        message={<span>Are you sure you want to delete this listing?</span>}
        warningText="This action cannot be undone. The listing will be permanently removed."
        cancelText="Cancel"
        confirmText="Delete Listing"
        isLoading={isSubmitting}
        style="red"
      />
    </div>
  );
};

export default ListingsTable;