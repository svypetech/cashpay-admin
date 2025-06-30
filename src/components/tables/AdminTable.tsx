"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/src/components/admins/AdminSidebar";
import ConfirmModal from "../ui/ConfirmModal";
import SuspendUserModal from "../ui/SuspendPopup";
import { Admin } from "@/src/Types/Admin";
import { formatJoiningDate } from "@/src/lib/functions";
import {
  handleActivateAdmin,
  handleBanAdmin,
  handleDeleteAdmin,
  handleSuspendAdmin,
} from "@/src/hooks/admins/AdminActions";
import ExpandableId from "../ui/ExpandableId";
import { useToast } from "@/src/lib/ToastProvider";

interface Props {
  headings: string[];
  data: Admin[];
  setData: React.Dispatch<React.SetStateAction<Admin[]>>;
}

const AdminTable: React.FC<Props> = ({ data, headings, setData }) => {
  const { showSuccess, showError } = useToast();
  const [success, setSuccess] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showAdminSidebar, setShowAdminSidebar] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Local state to track admin statuses for real-time updates
  const [adminStatuses, setAdminStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  // Confirmation modal states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState("");

  // Track data changes and update local admin statuses
  useEffect(() => {
    const statusMap: { [key: string]: string } = {};
    data.forEach((admin) => {
      statusMap[admin._id] = admin.userStatus || "Active";
    });
    setAdminStatuses(statusMap);
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
    setSelectedIndex(index);
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setShowAdminSidebar(true);
    setActiveDropdown(null);
  };

  // Handle suspend admin confirmation
  const handleSuspendConfirmation = (adminId: string) => {
    setShowSuspendModal(true);
    setActiveDropdown(null);
    setSelectedAdmin(data.find((admin) => admin._id === adminId) || null);
  };

  // Handle ban admin confirmation
  const handleBanConfirmation = (adminId: string) => {
    setShowBanModal(true);
    setActiveDropdown(null);
    setSelectedAdmin(data.find((admin) => admin._id === adminId) || null);
  };

  // Handle activate admin confirmation
  const handleActivateConfirmation = (adminId: string) => {
    setShowActivateModal(true);
    setActiveDropdown(null);
    setSelectedAdmin(data.find((admin) => admin._id === adminId) || null);
  };

  // Handle delete admin confirmation
  const handleDeleteConfirmation = (adminId: string) => {
    setShowDeleteModal(true);
    setActiveDropdown(null);
    setSelectedAdmin(data.find((admin) => admin._id === adminId) || null);
  };

  // Execute suspend admin
  const executeSuspendAdmin = async (days: number = 7) => {
    if (!selectedAdmin?._id) return;

    setIsSubmitting(true);
    setActionType("suspend");
    try {
      await handleSuspendAdmin({
        id: selectedAdmin._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
        days,
      });

      // Update both data and local status immediately
      setData((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, userStatus: "Suspended" }
            : admin
        )
      );

      // Update local status for immediate UI response
      setAdminStatuses((prev) => ({
        ...prev,
        [selectedAdmin._id]: "Suspended",
      }));
    } catch (error) {
      console.error("Error suspending admin:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowSuspendModal(false);
      setSuccess(false);
    }
  };

  // Execute ban admin
  const executeBanAdmin = async () => {
    if (!selectedAdmin?._id) return;

    setIsSubmitting(true);
    setActionType("ban");
    try {
      await handleBanAdmin({
        id: selectedAdmin._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

      // Update both data and local status immediately
      setData((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, userStatus: "Banned" }
            : admin
        )
      );

      // Update local status for immediate UI response
      setAdminStatuses((prev) => ({
        ...prev,
        [selectedAdmin._id]: "Banned",
      }));
    } catch (error) {
      console.error("Error banning admin:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowBanModal(false);
      setSuccess(false);
    }
  };

  // Execute activate admin
  const executeActivateAdmin = async () => {
    if (!selectedAdmin?._id) return;

    setIsSubmitting(true);
    setActionType("activate");
    try {
      await handleActivateAdmin({
        id: selectedAdmin._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

      // Update both data and local status immediately
      setData((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id
            ? { ...admin, userStatus: "Active" }
            : admin
        )
      );

      // Update local status for immediate UI response
      setAdminStatuses((prev) => ({
        ...prev,
        [selectedAdmin._id]: "Active",
      }));
    } catch (error) {
      console.error("Error activating admin:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowActivateModal(false);
      setSuccess(false);
    }
  };

  // Execute delete admin
  const executeDeleteAdmin = async () => {
    if (!selectedAdmin?._id) return;

    setIsSubmitting(true);
    setActionType("delete");
    try {
      await handleDeleteAdmin({
        id: selectedAdmin._id,
        setIsSubmitting,
        showSuccess,
        showError,
        setSuccess,
      });

      // Remove admin from local data array
      setData((prevAdmins) => prevAdmins.filter((admin) => admin._id !== selectedAdmin._id));

      // Remove admin from local status tracking
      setAdminStatuses((prev) => {
        const newStatuses = { ...prev };
        delete newStatuses[selectedAdmin._id];
        return newStatuses;
      });

      // Close sidebar if the deleted admin was being viewed
      if (showAdminSidebar && selectedAdmin) {
        setShowAdminSidebar(false);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    } finally {
      setIsSubmitting(false);
      setActionType("");
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      setSuccess(false);
    }
  };

  // Calculate if we need padding based on current state
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 3 || // Last three rows due to longer dropdown
      data.length <= 2); // If there are 2 or fewer rows, always add padding

  // Helper function to get current admin status (prioritizes local state)
  const getCurrentAdminStatus = (adminId: string) => {
    return adminStatuses[adminId] || "Active";
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add dynamic padding for dropdown space */}
      <div
        className={`rounded-lg overflow-x-auto w-full ${
          needsPadding ? "pb-40" : ""
        }`}
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
              data.map((admin, index) => {
                // Get current status from local state for real-time updates
                const currentStatus = getCurrentAdminStatus(admin._id);

                return (
                  <tr
                    key={index}
                    className="border-b border-gray-200 text-[12px] md:text-[16px]"
                  >
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px] break-words">
                      <ExpandableId id={admin._id} />
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                      {admin.name ? admin.name : "N/A"}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[150px] break-words">
                      {admin.email}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                      {formatJoiningDate(admin.date)}
                    </td>
                    <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px]">
                      {admin.role}
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
                              onClick={() => handleViewAdmin(admin)}
                            >
                              View
                            </button>
                            <div className="border-t border-gray-100"></div>

                            {/* Dynamic dropdown options based on current status */}
                            {currentStatus === "Active" && (
                              <>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                  onClick={() =>
                                    handleSuspendConfirmation(admin._id)
                                  }
                                >
                                  Suspend Admin
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                  onClick={() =>
                                    handleBanConfirmation(admin._id)
                                  }
                                >
                                  Ban Admin
                                </button>
                              </>
                            )}

                            {currentStatus !== "Active" && (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                onClick={() =>
                                  handleActivateConfirmation(admin._id)
                                }
                              >
                                Activate Admin
                              </button>
                            )}

                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                handleDeleteConfirmation(admin._id)
                              }
                            >
                              Delete Admin
                            </button>
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

      {/* Admin Profile Sidebar */}
      {selectedAdmin && (
        <AdminSidebar
          showSidebar={showAdminSidebar}
          onClose={() => setShowAdminSidebar(false)}
          admin={selectedAdmin}
          currentStatus={getCurrentAdminStatus(selectedAdmin._id)}
          setData={setData}
          onStatusUpdate={(adminId: string, newStatus: string) => {
            setAdminStatuses((prev) => ({
              ...prev,
              [adminId]: newStatus,
            }));
          }}
        />
      )}

      {/* Replace ConfirmModal with SuspendUserModal for suspend actions */}
      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        // userName={selectedAdmin?.name || "N/A"}
        onConfirm={(days) => executeSuspendAdmin(days)}
        isLoading={isSubmitting}
      />

      {/* Activate Admin Confirmation Modal */}
      <ConfirmModal
        isOpen={showActivateModal}
        onClose={() => !isSubmitting && setShowActivateModal(false)}
        onConfirm={executeActivateAdmin}
        title="Activate Admin"
        message="Are you sure you want to activate this admin? They will regain access to their admin account."
        warningText="This action will restore the admin's account access."
        cancelText="Cancel"
        confirmText="Activate Admin"
        isLoading={isSubmitting}
        style="blue"
      />

      {/* Ban Admin Confirmation Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => !isSubmitting && setShowBanModal(false)}
        onConfirm={executeBanAdmin}
        title="Ban Admin"
        message="Are you sure you want to ban this admin? They will lose access to their admin account permanently."
        warningText="This action is permanent and cannot be undone."
        cancelText="Cancel"
        confirmText="Ban Admin"
        isLoading={isSubmitting}
        style="red"
      />

      {/* Delete Admin Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => !isSubmitting && setShowDeleteModal(false)}
        onConfirm={executeDeleteAdmin}
        title="Delete Admin"
        message={`Are you sure you want to delete this admin. This action will permanently remove the admin from the system.`}
        warningText="This action is permanent and cannot be undone. All admin data will be lost."
        cancelText="Cancel"
        confirmText="Delete Admin"
        isLoading={isSubmitting}
        style="red"
      />
    </div>
  );
};

export default AdminTable;
