"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
import WalletSidebar from "../transaction/WalletSidebar";
import {Wallet} from "@/src/Types/Wallet"
import { formatNumberToTwoDecimals } from "@/src/lib/functions";

interface Props {
    headings: string[]
    data: Wallet[]
}

const WalletTable: React.FC<Props> = ({ data, headings }) => {
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
    const [showSidebar, setShowSidebar] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown !== null) {
                const target = event.target as HTMLElement
                if (!target.closest(".dropdown-container")) {
                    setActiveDropdown(null)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [activeDropdown])

    const toggleDropdown = (index: number) => {
        setActiveDropdown(activeDropdown === index ? null : index)
    }

    return (
        <div className="flex-1 rounded-lg w-full py-5">
            <div className="rounded-lg overflow-x-auto w-full pb-32">
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
                                    <td className="p-2 md:p-4 font-satoshi min-w-[100px] break-words">{wallet.data.userId}</td>
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
                                                    className="w-4 h-4"
                                                />
                                            </button>

                                            {activeDropdown === index && (
                                                <div className="absolute z-10 right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setSelectedWallet(wallet)
                                                            setShowSidebar(true)
                                                            setActiveDropdown(null)
                                                        }}
                                                    >
                                                        View Wallet
                                                    </button>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setActiveDropdown(null)
                                                            // handleBanUser(wallet.userId.toString())
                                                        }}
                                                    >
                                                        Ban User
                                                    </button>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                                                        onClick={() => {
                                                            setActiveDropdown(null)
                                                            // handleSuspendUser(wallet.userId.toString())
                                                        }}
                                                    >
                                                        Suspend User
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

            {/* Wallet Details Sidebar */}
            {selectedWallet && selectedWallet.data.balances.items && (
                <WalletSidebar
                    showSidebar={showSidebar}
                    onClose={() => setShowSidebar(false)}
                    wallet={selectedWallet}
                />
            )}
        </div>
    )
}

export default WalletTable;