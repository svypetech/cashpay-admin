"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import StuckTradePopup from "../p2pTrading/StuckTradePopup";
import ExpandableId from "../ui/ExpandableId";
import ColourfulBlock from "../ui/ColourfulBlock";
import axios from "axios";
import ConfirmModal from "../ui/ConfirmModal";
import Trade from "@/src/Types/Trades";
import { useToast } from "@/src/lib/ToastProvider";

interface Props {
  headings: string[];
  data: Trade[];
  setData: React.Dispatch<React.SetStateAction<Trade[]>>;
}

const P2PTableStuck: React.FC<Props> = ({ data, headings, setData }) => {
  const { showSuccess, showError } = useToast();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolvePopup, setShowResolvePopup] = useState(false);
  const [favor, setFavor] = useState<string>("");
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

  useEffect(() => {
    setFilteredTrades(data);
  }, [data]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/order/resolveDispute`,
        {
          orderId: selectedTrade ? selectedTrade.tradeId : "",
          favourOf: favor,
          comment: `Resolved in favor of ${favor} from stuck trades`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the local state with the resolved trade
      setData((prevTrades) =>
        prevTrades.map((trade) =>
          trade.tradeId === selectedTrade?.tradeId
            ? { ...trade, status: favor === "Buyer" ? "Resolved" : "Canceled" }
            : trade
        )
      );
      showSuccess("Trade resolved successfully!");
    } catch (error: any) {
      console.error("Error resolving trade:", error);
      showError("Failed to resolve trade. Please try again.");
    } finally {
      setShowResolvePopup(false);
      setIsSubmitting(false);
    }
  };

  // Calculate if we need padding based on current state
  const needsPadding = activeDropdown !== null && (
    selectedIndex >= (filteredTrades.length - 2) || // Last two rows
    filteredTrades.length <= 2 // If there are 2 or fewer rows, always add padding
  );

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add dynamic padding for dropdown space */}
      <div className={`rounded-lg overflow-x-auto w-full ${needsPadding ? "pb-28" : ""}`}>
        <table className="w-full text-left table-auto">
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
            {Array.isArray(filteredTrades) &&
              filteredTrades.map((trade, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.tradeId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.sellerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.buyerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    {trade.amountt}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    {trade.currency}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px]">
                    <ColourfulBlock
                      text={trade.reason ? trade.reason : "N/A"}
                      className={`text-center rounded-xl md:text-md font-semibold bg-[#EFE40833] text-[#B0A700] `}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    <ColourfulBlock
                      text={trade.status ? trade.status : "Locked"}
                      className={`text-center rounded-xl md:text-md font-semibold ${
                        trade.status.toLowerCase() === "resolved"
                          ? "text-success bg-successBg"
                          : trade.status.toLowerCase() === "canceled"
                          ? "bg-fail/20 text-tail"
                          : "bg-[#72727233] text-[#727272]"
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
                        <div className="absolute z-10 right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                            onClick={() => {
                              setSelectedTrade(trade);
                              setShowPopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            {"View Details"}
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm text-primary font-bold hover:bg-gray-50 border-b border-gray-100 ${
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            disabled={
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                            }
                            onClick={() => {
                              setFavor("Buyer");
                              setSelectedTrade(trade);
                              setShowResolvePopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            Release Escrow
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm text-[#DF1D1D] font-bold hover:bg-gray-50 ${
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            disabled={
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                            }
                            onClick={() => {
                              setFavor("Seller");
                              setSelectedTrade(trade);
                              setShowResolvePopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            Cancel Transaction
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
        <StuckTradePopup
          showPopup={showPopup}
          onClose={() => setShowPopup(false)}
          trade={selectedTrade}
          setFavor={setFavor}
          setShowResolvePopup={setShowResolvePopup}
          status={selectedTrade.status}
        />
      )}

      {/* Confirm Modal based on favor */}
      {favor === "Buyer" ? (
        <ConfirmModal
          isOpen={showResolvePopup}
          onClose={() => setShowResolvePopup(false)}
          onConfirm={handleSubmit}
          title={`Release Escrow`}
          message={`Are you sure you want to release escrow this trade?`}
          cancelText="Cancel"
          confirmText="Confirm"
          isLoading={isSubmitting}
          style="blue"
        />
      ) : (
        <ConfirmModal
          isOpen={showResolvePopup}
          isLoading={isSubmitting}
          onClose={() => setShowResolvePopup(false)}
          onConfirm={handleSubmit}
          title="Cancel Trade"
          message="Are you sure you want to cancel this trade? This action cannot be undone."
          style={"red"}
        />
      )}
    </div>
  );
};

export default P2PTableStuck;