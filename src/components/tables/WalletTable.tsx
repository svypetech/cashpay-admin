"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
import WalletSidebar from "../transaction/WalletSidebar";
import ConfirmModal from "../ui/ConfirmModal";
import {Wallet} from "@/src/Types/Wallet"
import { formatNumberToTwoDecimals } from "@/src/lib/functions";
import handleBanUser from "@/src/hooks/users/banUser";
import handleSuspendUser from "@/src/hooks/users/suspendUser";
import handleActivateUser from "@/src/hooks/users/activateUser";
import ExpandableId from "../ui/ExpandableId";
import { useToast } from "@/src/lib/ToastProvider";
import SuspendUserModal from "../ui/SuspendPopup";

interface Props {
    headings: string[]
    data: Wallet[]
    setData: React.Dispatch<React.SetStateAction<Wallet[]>>
}

const WalletTable: React.FC<Props> = ({ data, headings, setData }) => {
    const { showSuccess, showError } = useToast();
    const [success, setSuccess] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    
    // Confirmation modal states
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showActivateModal, setShowActivateModal] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState<string | null>(null);
    const [userToBan, setUserToBan] = useState<string | null>(null);
    const [userToActivate, setUserToActivate] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown !== null) {
                const target = event.target as HTMLElement;
                if (!target.closest(".dropdown-container")) {
                    setActiveDropdown(null);
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [activeDropdown]);

    const toggleDropdown = (index: number) => {
        setSelectedIndex(index);
        setActiveDropdown(activeDropdown === index ? null : index);
    }

    // Handle suspend user confirmation
    const handleSuspendConfirmation = (userId: string) => {
        setUserToSuspend(userId);
        setShowSuspendModal(true);
        setActiveDropdown(null);
    }

    // Handle ban user confirmation
    const handleBanConfirmation = (userId: string) => {
        setUserToBan(userId);
        setShowBanModal(true);
        setActiveDropdown(null);
    }

    // Handle activate user confirmation
    const handleActivateConfirmation = (userId: string) => {
        setUserToActivate(userId);
        setShowActivateModal(true);
        setActiveDropdown(null);
    }

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
            
            // Update local state
            setData((prevWallets) =>
                prevWallets.map((wallet) =>
                    wallet.data.user_id.toString() === userToSuspend
                        ? { 
                            ...wallet, 
                            data: { 
                                ...wallet.data, 
                                userStatus: "Suspended" 
                            } 
                        }
                        : wallet
                )
            );
        } catch (error) {
            console.error("Error suspending user:", error);
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowSuspendModal(false);
            setUserToSuspend(null);
            setSuccess(false);
        }
    }

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
                setSuccess
            });    
            
            // Update local state
            setData((prevWallets) =>
                prevWallets.map((wallet) =>
                    wallet.data.user_id.toString() === userToBan
                        ? { 
                            ...wallet, 
                            data: { 
                                ...wallet.data, 
                                userStatus: "Banned" 
                            } 
                        }
                        : wallet
                )
            );
        } catch (error) {
            console.error("Error banning user:", error);
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowBanModal(false);
            setUserToBan(null);
            setSuccess(false);
        }
    }

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
                setSuccess
            });
            
            // Update local state
            setData((prevWallets) =>
                prevWallets.map((wallet) =>
                    wallet.data.user_id.toString() === userToActivate
                        ? { 
                            ...wallet, 
                            data: { 
                                ...wallet.data, 
                                userStatus: "Active" 
                            } 
                        }
                        : wallet
                )
            );
        } catch (error) {
            console.error("Error activating user:", error);
        } finally {
            setIsSubmitting(false);
            setActionType("");
            setShowActivateModal(false);
            setUserToActivate(null);
            setSuccess(false);
        }
    }

    const needsPadding = activeDropdown !== null && (
        selectedIndex >= (data.length - 2) || // Last two rows
        data.length <= 2 // If there are 2 or fewer rows, always add padding
    );

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table - Add dynamic padding for dropdown space */}
            <div className={`rounded-lg overflow-x-auto w-full ${needsPadding ? "pb-32" : ""}`}>
                <table className="w-full text-left table-auto">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] md:text-[16px] p-2 md:p-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="p-2 md:p-4 text-left">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((wallet, index) => (
                                <tr key={index} className="border-b border-gray-200 text-[12px] md:text-[16px]">
                                    <td className="p-2 md:p-4 font-satoshi min-w-[100px] break-words">
                                        <ExpandableId id={wallet.data.user_id} />
                                    </td>
                                    <td className="p-2 md:p-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                        {wallet.data.userName ? `${wallet.data.userName.firstName} ${wallet.data.userName.lastName}` : "N/A"}
                                    </td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[150px] break-words">{"-"}</td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[120px]">
                                        <span className="relative left-[30px]">{wallet.data.cryptoHoldings}</span>
                                    </td>
                                    <td className="p-2 md:p-4 font-satoshi min-w-[100px]">{formatNumberToTwoDecimals(wallet.data.totalBalanceUSD)}</td>
                                    <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] text-center">
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
                                                            setSelectedWallet(wallet);
                                                            setShowSidebar(true);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        View Wallet
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    {wallet.data.userStatus === "Active" && <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSuspendConfirmation(wallet.data.user_id)}
                                                    >
                                                        Suspend User
                                                    </button>}
                                                    {wallet.data.userStatus === "Active" && <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleBanConfirmation(wallet.data.user_id)}
                                                    >
                                                        Ban User
                                                    </button>}
                                                    {wallet.data.userStatus !== "Active" && <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleActivateConfirmation(wallet.data.user_id)}
                                                    >
                                                        Activate User
                                                    </button>}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Wallet Sidebar */}
            {selectedWallet && (
                <WalletSidebar
                    showSidebar={showSidebar}
                    onClose={() => setShowSidebar(false)}
                    wallet={selectedWallet}
                />
            )}

            {/* Activate User Confirmation Modal */}
            <ConfirmModal
                isOpen={showActivateModal}
                onClose={() => !isSubmitting && setShowActivateModal(false)}
                onConfirm={executeActivateUser}
                title="Activate User"
                message="Are you sure you want to activate this user? They will regain access to their account."
                warningText="This action will restore the user's account access."
                cancelText="Cancel"
                confirmText="Activate User"
                isLoading={isSubmitting}
                style="blue"
            />

            {/* Replace ConfirmModal with SuspendUserModal for suspend actions */}
            <SuspendUserModal
                isOpen={showSuspendModal}
                onClose={() => setShowSuspendModal(false)}
                userName={
                    data.find(wallet => wallet.data.user_id === userToSuspend)?.data.userName
                        ? data.find(wallet => wallet.data.user_id === userToSuspend)?.data.userName.firstName + " " +
                          data.find(wallet => wallet.data.user_id === userToSuspend)?.data.userName.lastName
                        : "N/A"
                }
                onConfirm={(days) => executeSuspendUser(days)}
                isLoading={isSubmitting}
            />

            {/* Ban User Confirmation Modal */}
            <ConfirmModal
                isOpen={showBanModal}
                onClose={() => !isSubmitting && setShowBanModal(false)}
                onConfirm={executeBanUser}
                title="Ban User"
                message="Are you sure you want to ban this user? They will lose access to their account permanently."
                warningText="This action is permanent and cannot be undone."
                cancelText="Cancel"
                confirmText="Ban User"
                isLoading={isSubmitting}
                style="red"
            />
        </div>
    )
}

export default WalletTable;