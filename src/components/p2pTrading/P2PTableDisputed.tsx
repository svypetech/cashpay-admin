"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import DisputeDetailsCard from "../p2pTrading/DisputeDetailsCard";
import DisputeResolutionPopup from "../p2pTrading/ResolveDisputePopup";
import ExpandableId from "../ui/ExpandableId";
import ColourfulBlock from "../ui/ColourfulBlock";
import axios from "axios";
import DisputeSkeletonCard from "../skeletons/DisputeSkeletonCard";
import Trade from "@/src/Types/Trades";
import { shortenAddress } from "@/src/lib/functions";
import useFetchP2PChat from "@/src/hooks/p2p/useFetchP2PChat";
import P2PChatSidebar from "./P2PChatSidebar";
import { useToast } from "@/src/lib/ToastProvider";

interface Props {
  headings: string[];
  data: Trade[];
  setData: React.Dispatch<React.SetStateAction<Trade[]>>;
}

interface SellerBuyer {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  joinDate: string;
  id: number;
  _id: string;
  image: string;
  totalTrades: number;
  successRate: number;
}

const P2PTableDisputed: React.FC<Props> = ({ data, headings, setData }) => {
  const { showSuccess, showError } = useToast();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showResolvePopup, setShowResolvePopup] = useState(false);
  const [favor, setFavor] = useState<string>("");
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat sidebar states
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>("");

  const [isFetchingSeller, setIsFetchingSeller] = useState(false);
  const [sellerAndBuyerDetails, setSellerAndBuyerDetails] = useState({
    seller: {} as SellerBuyer,
    buyer: {} as SellerBuyer,
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 2 || data.length <= 2);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use the chat hook
  const {
    messages,
    isLoading: isChatLoading,
    isLoadingMore,
    isError: chatError,
    currentChatUser,
    loadMoreMessages,
    hasMore,
  } = useFetchP2PChat({
    chatId: selectedChatId,
    setChatSidebarOpen: setShowChatSidebar,
  });

  const getSellerAndBuyerDetails = async (trade: Trade) => {
    if (!trade) return;
    try {
      setIsFetchingSeller(true);
      let response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/order/sellerBuyerDetails/?orderId=${trade.tradeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSellerAndBuyerDetails({
        seller: response.data.data.seller,
        buyer: response.data.data.buyer,
      });
    } catch (error: any) {
      showError(
        "Failed to fetch seller and buyer details: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error fetching seller and buyer details:", error);
    } finally {
      setIsFetchingSeller(false);
    }
  };

  // Handle chat link click
  const handleChatClick = (trade: Trade) => {
    setSelectedChatId(trade.tradeId); // This will trigger the useFetchChat hook
  };

  // Handle chat sidebar close
  const handleCloseChatSidebar = () => {
    setShowChatSidebar(false);
    setSelectedChatId(""); // Clear the chat ID
  };

  // Create default chat user if no user data is available

  const handleView = (trade: Trade) => {
    if (selectedTrade) {
      setSelectedTrade(null);
    } else {
      setSelectedTrade(trade);
      getSellerAndBuyerDetails(trade);
    }
    setShowDetails(!showDetails);
    setActiveDropdown(null);
  };

  const handleResolve = (type: string, trade?: Trade) => {
    setShowResolvePopup(true);
    setActiveDropdown(null);
    setFavor(type);
    if (trade) setSelectedTrade(trade);
  };

  const handleSubmit = async (comments: string) => {
    setIsSubmitting(true);

    try {
      let response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/order/resolveDispute`,
        {
          orderId: selectedTrade ? selectedTrade.tradeId : "",
          favourOf: favor,
          comment: comments,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      showSuccess("Dispute resolved successfully!");
      setData((prevTrades) =>
        prevTrades.map((trade) =>
          trade.tradeId === selectedTrade?.tradeId
            ? { ...trade, status: "Resolved" }
            : trade
        )
      );
    } catch (error: any) {
      showError(
        "Failed to resolve dispute: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error resolving dispute:", error);
    } finally {
      setShowResolvePopup(false);
      setIsSubmitting(false);
    }
  };

  const toggleDropdown = (index: number) => {
    setSelectedIndex(index);
    setActiveDropdown(activeDropdown === index ? null : index);
  };

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

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className={`rounded-lg overflow-x-auto w-full pb-[30px]  ${
          needsPadding ? "pb-[100px]" : ""
        }`}
        ref={tableRef}
      >
        <table className="w-full text-left table-auto min-w-[600px]">
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
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">
                    <ExpandableId id={trade.tradeId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.sellerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.buyerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px]">
                    <ColourfulBlock
                      text={trade.reason ? trade.reason : "N/A"}
                      className={`text-center rounded-xl md:text-md font-semibold bg-[#DF1D1D33] text-[#DF1D1D] whitespace-nowrap sm:min-w-[180px]`}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    <ColourfulBlock
                      text={trade.status ? trade.status : "Open"}
                      className={`text-center rounded-xl md:text-md font-semibold bg-successBg  text-success `}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    <button
                      onClick={() => handleChatClick(trade)}
                      className="text-[12px] md:text-[16px] px-4 py-2 text-primary underline decoration-primary cursor-pointer hover:text-primary/80 transition-colors"
                    >
                      {`chat.cashpay/${shortenAddress(trade.tradeId)}`}
                    </button>
                  </td>
                  <td className="relative px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="flex items-center justify-center w-[80%] lg:w-[100%] xl:w-[70%] 2xl:w-[50%]  cursor-pointer"
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
                          className="absolute z-10 right-0 w-45 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-3 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleView(trade)}
                          >
                            {showDetails &&
                            selectedTrade &&
                            selectedTrade.tradeId === trade.tradeId
                              ? "Back to all Trades"
                              : "View Details"}
                          </button>
                          {trade.status.toLowerCase() !== "resolved" && (
                            <>
                              <div className="border-t border-gray-100"></div>
                              <button
                                className={`block w-full text-left px-4 py-2 text-sm text-primary font-bold  hover:bg-gray-50 ${
                                  trade.status.toLowerCase() === "resolved"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                onClick={() => handleResolve("Buyer", trade)}
                              >
                                Resolve in Favour of Buyer
                              </button>
                              <button
                                className={`block w-full text-left px-4 py-2 text-sm text-primary font-bold hover:bg-gray-50 ${
                                  trade.status.toLowerCase() === "resolved"
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                                onClick={() => handleResolve("Seller", trade)}
                              >
                                Resolve in Favour of Seller
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Display skeleton cards while fetching data */}
      {selectedTrade && showDetails && isFetchingSeller && (
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <DisputeSkeletonCard title="Buyer Details" />
          <DisputeSkeletonCard title="Seller Details" />
        </div>
      )}

      {/* Display actual cards when data is ready */}
      {selectedTrade && showDetails && !isFetchingSeller && (
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div>
            <DisputeDetailsCard
              title="Buyer Details"
              user={sellerAndBuyerDetails.buyer}
              buttonText={"Resolve: in Favor of Buyer"}
              onButtonClick={() => handleResolve("Buyer")}
              isResolved={selectedTrade.status.toLowerCase() === "resolved"}
            />
          </div>
          <div>
            <DisputeDetailsCard
              title="Seller Details"
              user={sellerAndBuyerDetails.seller}
              buttonText={"Resolve: in Favor of Seller"}
              onButtonClick={() => handleResolve("Seller")}
              isResolved={selectedTrade.status.toLowerCase() === "resolved"}
            />
          </div>
        </div>
      )}

      {/* Resolve Dispute Popup */}
      {showResolvePopup && (
        <DisputeResolutionPopup
          isOpen={showResolvePopup}
          onClose={() => setShowResolvePopup(false)}
          disputeId={selectedTrade ? selectedTrade.tradeId : ""}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}

      {/* Chat Sidebar */}
      <P2PChatSidebar
        isOpen={showChatSidebar}
        onClose={handleCloseChatSidebar}
        chatId={selectedChatId}
        user={currentChatUser}
        initialMessages={messages}
        isLoading={isChatLoading}
        isError={chatError}
        loadMoreMessages={loadMoreMessages}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
    </div>
  );
};

export default P2PTableDisputed;

