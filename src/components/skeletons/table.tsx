"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"

const TableSkeleton: React.FC = () => {
  const { darkMode } = useDarkMode() // Get dark mode state
  const [showDark, setShowDark] = useState(darkMode)

  useEffect(() => {
    // Delay state update slightly to enable smooth transition
    const timeout = setTimeout(() => setShowDark(darkMode), 100)
    return () => clearTimeout(timeout)
  }, [darkMode])

  // Create an array of 10 items for skeleton rows
  const skeletonRows = Array(10).fill(null)

  return (
    <div className={`flex-1 rounded-lg shadow-lg w-full`} style={{ boxShadow: "0px 0px 12px 2px rgba(0, 0, 0, 0.06)" }}>
      {/* Table */}
      <div className="shadow-md rounded-lg overflow-hidden w-full">
        <table className="w-full text-left table-fixed min-w-30">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] p-2 sm:p-4">
              <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Token</th>
              <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Current Price</th>
              <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Total Supply</th>
              <th className="p-2 sm:p-4 text-left w-1/5 sm:w-2/6">Total Volume</th>
              <th className="p-2 sm:p-4 text-left w-1/5 sm:w-3/6">Price Change 24h</th>
            </tr>
          </thead>
          <tbody>
            {skeletonRows.map((_, index) => (
              <tr key={index} className="border-b text-[12px] sm:text-[16px]">
                <td className="p-2 sm:p-4 w-2/6 min-w-0">
                  <div className={`h-6 ${showDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse w-3/4`}></div>
                </td>
                <td className="p-2 sm:p-4 w-3/6 min-w-0">
                  <div className={`h-6 ${showDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse w-1/2`}></div>
                </td>
                <td className="p-2 sm:p-4 w-2/6 min-w-0">
                  <div className={`h-6 ${showDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse w-2/3`}></div>
                </td>
                <td className="p-2 sm:p-4 w-1/6 min-w-0">
                  <div className={`h-6 ${showDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse w-1/2`}></div>
                </td>
                <td className="p-2 sm:p-4 w-1/6 min-w-0">
                  <div className={`h-6 ${showDark ? "bg-gray-700" : "bg-gray-200"} rounded animate-pulse w-3/5`}></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableSkeleton

