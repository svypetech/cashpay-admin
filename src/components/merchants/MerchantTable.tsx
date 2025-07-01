"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ColourfulBlock from "../ui/ColourfulBlock";
import MerchantInfoSidebar from "./MerchantInfoSidebar";
import ConfirmModal from "../ui/ConfirmModal";
import SuspendUserModal from "../ui/SuspendPopup";
import Merchant from "@/src/Types/Merchant";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleBanUser from "@/src/hooks/users/banUser";
import handleActivateUser from "@/src/hooks/users/activateUser";
import { formatNumberToTwoDecimals, isUserActive } from "@/src/lib/functions";
import ExpandableId from "../ui/ExpandableId";
import { useToast } from "@/src/lib/ToastProvider";

interface MerchantsTableProps {
  headings: string[];
  merchants: Merchant[];
  setMerchants: React.Dispatch<React.SetStateAction<Merchant[]>>;
  onViewUser: (userId: string) => void;
}

export default function MerchantsTable({
  headings,
  merchants,
  setMerchants,
  onViewUser,
}: MerchantsTableProps) {
  const { showSuccess, showError } = useToast();
  const [success, setSuccess] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Local state to track merchant statuses for real-time updates
  const [merchantStatuses, setMerchantStatuses] = useState<{[key: string]: string}>({});

  // Confirmation modal states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [userToActivate, setUserToActivate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");

  // Track merchant data changes and update local statuses
  useEffect(() => {
    const statusMap: {[key: string]: string} = {};
    merchants.forEach(merchant => {
      statusMap[merchant._id] = merchant.status || merchant.status || "Active";
    });
    setMerchantStatuses(statusMap);
  }, [merchants]);

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
    setSelectedIndex(index);
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Add a function to handle viewing a merchant
  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowSidebar(true);
    setActiveDropdown(null);
  };

  // Handle suspend user confirmation
  const handleSuspendConfirmation = (userId: string) => {
    setUserToSuspend(userId);
    setShowSuspendModal(true);
    setActiveDropdown(null);
  };

  // Handle ban user confirmation
  const handleBanConfirmation = (userId: string) => {
    setUserToBan(userId);
    setShowBanModal(true);
    setActiveDropdown(null);
  };

  // Handle activate user confirmation
  const handleActivateConfirmation = (userId: string) => {
    setUserToActivate(userId);
    setShowActivateModal(true);
    setActiveDropdown(null);
  };

  // Execute suspend user with proper toast integration
  const executeSuspendUser = async (days: number) => {
    if (!userToSuspend) return;
    
    setIsSubmitting(true);
    setActionType("suspend");
    try {
      await handleSuspendUser({
        id: userToSuspend,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
        days
      });
      
      // Update both merchants data and local status
      if (setMerchants) {
        setMerchants(prevData => 
          prevData.map(merchant => 
            merchant._id === userToSuspend ? { ...merchant, status: "suspend" } : merchant
          )
        );
      }
      
      // Update local status for immediate UI response
      setMerchantStatuses(prev => ({
        ...prev,
        [userToSuspend]: "suspend"
      }));
      
    } catch (error) {
      console.error("Error suspending merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowSuspendModal(false);
      setUserToSuspend(null);
      setSuccess(false);
    }
  };

  // Execute ban user with proper toast integration
  const executeBanUser = async () => {
    if (!userToBan) return;
    
    setIsSubmitting(true);
    setActionType("ban");
    try {
      await handleBanUser({
        id: userToBan,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });
      
      // Update both merchants data and local status
      if (setMerchants) {
        setMerchants(prevData => 
          prevData.map(merchant => 
            merchant._id === userToBan ? { ...merchant, status: "banned" } : merchant
          )
        );
      }
      
      // Update local status for immediate UI response
      setMerchantStatuses(prev => ({
        ...prev,
        [userToBan]: "banned"
      }));
      
    } catch (error) {
      console.error("Error banning merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowBanModal(false);
      setUserToBan(null);
      setSuccess(false);
    }
  };

  // Execute activate user with proper toast integration
  const executeActivateUser = async () => {
    if (!userToActivate) return;
    
    setIsSubmitting(true);
    setActionType("activate");
    try {
      await handleActivateUser({
        id: userToActivate,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });
      
      // Update both merchants data and local status
      if (setMerchants) {
        setMerchants(prevData =>
          prevData.map(merchant =>
            merchant._id === userToActivate ? { ...merchant, status: "Active" } : merchant
          )
        );
      }
      
      // Update local status for immediate UI response
      setMerchantStatuses(prev => ({
        ...prev,
        [userToActivate]: "Active"
      }));
      
    } catch (error) {
      console.error("Error activating merchant:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowActivateModal(false);
      setUserToActivate(null);
      setSuccess(false);
    }
  };

  // Helper function to get current merchant status
  const getCurrentMerchantStatus = (merchantId: string) => {
    return merchantStatuses[merchantId] || "Active";
  };

  // Calculate if we need padding based on current state
  const needsPadding = activeDropdown !== null && (
    selectedIndex >= (merchants.length - 2) || // Last two rows
    merchants.length <= 2 // If there are 2 or fewer rows, always add padding
  );

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add dynamic padding for dropdown space */}
      <div className={`rounded-lg overflow-x-auto w-full ${needsPadding ? "pb-24" : ""}`}>
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
              merchants.map((merchant, index) => {
                // Get current status from local state for real-time updates
                const currentStatus = getCurrentMerchantStatus(merchant._id);
                
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                  >
                    <td className="p-2 sm:p-6 font-satoshi min-w-[100px] break-words whitespace-nowrap">
                      <ExpandableId id={merchant._id} />
                    </td>
                    <td className="p-2 sm:p-6 font-satoshi font-bold text-primary min-w-[120px] break-words whitespace-nowrap">
                      {merchant.name.firstName ? (`${merchant.name.firstName} ${merchant.name.lastName}`) : "N/A"}
                    </td>
                    <td className="p-2 sm:p-6 font-satoshi min-w-[150px] break-words whitespace-nowrap">
                      {merchant.email}
                    </td>
                    <td className="p-2 sm:p-6 font-satoshi min-w-[100px] whitespace-nowrap">
                      <p className="text-center">{merchant.completedTrades}</p>
                    </td>
                    <td className="p-2 sm:p-6 font-satoshi min-w-[120px] whitespace-nowrap">
                      <p className="text-center">{formatNumberToTwoDecimals(merchant.successRate)}%</p>
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
                              className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                              onClick={() => handleViewMerchant(merchant)}
                            >
                              View
                            </button>
                            
                            {/* Dynamic dropdown options based on current merchant status */}
                            {isUserActive(currentStatus) ? (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                                  onClick={() => handleSuspendConfirmation(merchant._id)}
                                >
                                  Suspend User
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                  onClick={() => handleBanConfirmation(merchant._id)}
                                >
                                  Ban User
                                </button>
                              </>
                            ) : (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                onClick={() => handleActivateConfirmation(merchant._id)}
                              >
                                Activate User
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Sidebar for merchant info */}
      {selectedMerchant && (
        <MerchantInfoSidebar
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
          merchant={selectedMerchant}
          setMerchants={setMerchants}
          onStatusUpdate={(merchantId: string, newStatus: string) => {
            setMerchantStatuses(prev => ({
              ...prev,
              [merchantId]: newStatus
            }));
          }}
        />
      )}

      {/* Activate Merchant Confirmation Modal */}
      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => !isSubmitting && setShowActivateModal(false)}
        onConfirm={executeActivateUser}
        title="Activate Merchant"
        message="Are you sure you want to activate this merchant? They will regain access to their account."
        warningText="This action will restore the merchant's account access."
        cancelText="Cancel"
        confirmText="Activate Merchant"
        isLoading={isSubmitting}
        style="blue"
      />

      {/* Replace ConfirmModal with SuspendUserModal for suspend actions */}
      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        userName={
          merchants.find(merchant => merchant._id === userToSuspend)?.name
            ? merchants.find(merchant => merchant._id === userToSuspend)?.name?.firstName + " " +
              merchants.find(merchant => merchant._id === userToSuspend)?.name?.lastName
            : "N/A"
        }
        onConfirm={(days) => executeSuspendUser(days)}
        isLoading={isSubmitting}
      />

      {/* Ban Merchant Confirmation Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => !isSubmitting && setShowBanModal(false)}
        onConfirm={executeBanUser}
        title="Ban Merchant"
        message="Are you sure you want to ban this merchant? They will lose access to their account permanently."
        warningText="This user will not be able to access their account."
        cancelText="Cancel"
        confirmText="Ban Merchant"
        isLoading={isSubmitting}
        style="red"
      />
    </div>
  );
}