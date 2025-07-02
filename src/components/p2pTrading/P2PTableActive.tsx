"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import TradeDetailsPopup from "../p2pTrading/TradeDetailsPopup";
import ColourfulBlock from "../ui/ColourfulBlock";
import axios from "axios";
import ConfirmModal from "../ui/ConfirmModal";
import ExpandableId from "../ui/ExpandableId";
import Trade from "@/src/Types/Trades";
import { useToast } from "@/src/lib/ToastProvider";

interface Props {
  headings: string[];
  data: Trade[];
  setData: React.Dispatch<React.SetStateAction<Trade[]>>;
}

const P2PTableActive: React.FC<Props> = ({ data, headings, setData }) => {
  const { showSuccess, showError } = useToast();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showResolvePopup, setShowResolvePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/order/resolveDispute`,
        {
          orderId: selectedTrade ? selectedTrade.tradeId : "",
          favourOf: "Seller",
          comment: "Resolved in favour of seller, from active tabs",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success === true) {
        showSuccess("Trade canceled successfully");
      } else {
        showError("Failed to cancel trade");
      }
      // update the local state to canceled
      setData((prevTrades) =>
        prevTrades.map((trade) =>
          trade.tradeId === selectedTrade?.tradeId
            ? { ...trade, status: "Canceled" }
            : trade
        )
      );
    } catch (error: any) {
      console.error("Error canceling trade:", error);
      showError("Failed to cancel trade");
    } finally {
      setShowResolvePopup(false);
      setIsSubmitting(false);
    }
  };

  // Calculate if we need padding based on current state
  const needsPadding = activeDropdown !== null && (
    selectedIndex >= (data.length - 1) || // Last two rows
    data.length <= 1 // If there are 2 or fewer rows, always add padding
  );

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add dynamic padding for dropdown space */}
      <div className={`rounded-lg overflow-x-auto w-full ${needsPadding ? "pb-16" : ""}`}>
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th key={index} className="px-2 md:px-4 py-3 md:py-4 text-left">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((trade, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[100px]">
                    <ExpandableId id={trade.tradeId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.sellerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.buyerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[100px]">
                    {trade.amountt}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[100px]">
                    {trade.currency}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi">
                    <ColourfulBlock
                      text={trade.payment}
                      className={`text-center md:text-md font-semibold bg-[#71FB5533] text-[#20C000] sm:min-w-[150px] min-w-[105px] `}
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi">
                    <ColourfulBlock
                      text={trade.status}
                      className={`text-center rounded-xl md:text-md font-semibold ${
                        trade.status.toLowerCase() === "canceled"
                          ? "bg-fail/20 text-fail"
                          : "text-[#727272] bg-[#72727233]"
                      }`}
                    />
                  </td>
                  <td className="relative px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative inline-block">
                      <button
                        className="relative cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-5 h-5"
                        />
                      </button>

                      {activeDropdown === index && (
                        <div className="absolute z-10 right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedTrade(trade);
                              setShowPopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            View Details
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm text-red-500 font-bold hover:bg-gray-50 ${
                              trade.status.toLowerCase() === "canceled"
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            onClick={() => {
                              setSelectedTrade(trade);
                              setShowResolvePopup(true);
                              setActiveDropdown(null);
                            }}
                            disabled={trade.status.toLowerCase() === "canceled"}
                          >
                            Cancel trade
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

      {/* Trade Details Popup */}
      {selectedTrade && (
        <TradeDetailsPopup
          showPopup={showPopup}
          onClose={() => setShowPopup(false)}
          trade={selectedTrade}
        />
      )}

      {/* Show confirm modal from ui folder */}
      <ConfirmModal
        isOpen={showResolvePopup}
        isLoading={isSubmitting}
        onClose={() => setShowResolvePopup(false)}
        onConfirm={handleSubmit}
        title="Cancel Trade"
        message="Are you sure you want to cancel this trade? This action cannot be undone."
        style={"red"}
      />
    </div>
  );
};

export default P2PTableActive;