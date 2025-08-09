"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import OrderDetailsSidebar from "../cards/OrderDetailsSidebar";
import ColourfulBlock from "../ui/ColourfulBlock";
import { CardOrder } from "@/src/Types/CardOrder";

interface Props {
  headings: string[];
  data: CardOrder[];
}

const getOrderStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "dispatched":
      return {
        text: "Dispatched",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#EFE40833] text-[#B0A700]",
      };
    case "completed":
      return {
        text: "Completed",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]",
      };
    case "approved":
      return {
        text: "Approved",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]",
      };
    case "frozen":
      return {
        text: "Frozen",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#FF6B6B33] text-[#FF6B6B]",
      };
    case "pending":
      return {
        text: "Pending",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#FFA50033] text-[#FFA500]",
      };
    default:
      return {
        text: status,
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#72727233] text-[#727272]",
      };
  }
};

const getCardStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "active":
      return {
        text: "Active",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#71FB5533] text-[#20C000]",
      };
    case "inactive":
      return {
        text: "Inactive",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#72727233] text-[#727272]",
      };
    case "blocked":
      return {
        text: "Blocked",
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#FF6B6B33] text-[#FF6B6B]",
      };
    default:
      return {
        text: status,
        className:
          "text-center rounded-xl text-xs md:text-base font-semibold bg-[#72727233] text-[#727272]",
      };
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};

const truncateId = (id: string, maxLength: number = 12) => {
  if (id.length <= maxLength) return id;
  return `${id.substring(0, maxLength)}...`;
};

const CardOrdersTable: React.FC<Props> = ({ data, headings }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CardOrder | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<CardOrder[]>(data);

  useEffect(() => {
    setFilteredOrders(data);
  }, [data]);

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
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add padding bottom for dropdown space */}
      <div className="rounded-lg overflow-x-auto w-full pb-12 lg:pb-10">
        <table className="w-full text-left table-auto font-[satoshi]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className={`px-2 md:px-4 py-3 md:py-4 ${
                    heading === "Delivery Address" ? "text-center" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredOrders) &&
              filteredOrders.map((order, index) => (
                <tr
                  key={order.orderId || index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <span title={order.orderId}>
                      {truncateId(order.orderId)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <span title={order.userId}>
                      {truncateId(order.userId)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    {order.cardType}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px] break-words text-center">
                    {order.deliveryAddress || "N/A"}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                    {(() => {
                      const statusConfig = getOrderStatusConfig(
                        order.orderStatus
                      );
                      return (
                        <ColourfulBlock
                          text={statusConfig.text.charAt(0).toUpperCase() + statusConfig.text.slice(1)}
                          className={statusConfig.className}
                        />
                      );
                    })()}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                    {(() => {
                      const statusConfig = getCardStatusConfig(order.cardStatus);
                      return (
                        <ColourfulBlock
                          text={statusConfig.text}
                          className={statusConfig.className}
                        />
                      );
                    })()}
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
                              // Use the actual order data with userDetails if available
                              const orderWithDetails = {
                                ...order,
                                // Map userDetails if available, otherwise use defaults
                                userEmail: order.userDetails?.email || "N/A",
                                userName: order.userDetails?.name 
                                  ? `${order.userDetails.name.firstName} ${order.userDetails.name.lastName}`
                                  : "N/A",
                                userJoiningDate: order.userDetails?.joinDate || "N/A",
                                userImage: order.userDetails?.image || "",
                                // Keep the original field names for backward compatibility
                                orderID: order.orderId,
                                userID: order.userId,
                              };
                              setSelectedOrder(orderWithDetails);
                              setShowSidebar(true);
                              setActiveDropdown(null);
                            }}
                          >
                            View Details
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

      {/* Order Details Sidebar */}
      {showSidebar && (
        <OrderDetailsSidebar 
          // @ts-ignore
          order={selectedOrder}
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default CardOrdersTable;