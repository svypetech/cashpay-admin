"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"

const TransactionCardSkeleton: React.FC = () => {
  const { darkMode } = useDarkMode()
  const [showDark, setShowDark] = useState(darkMode)

  useEffect(() => {
    // Delay state update slightly to enable smooth transition
    const timeout = setTimeout(() => setShowDark(darkMode), 100)
    return () => clearTimeout(timeout)
  }, [darkMode])

  return (
    <div
      className={`border-l ${showDark ? "border-l-secondary" : "border-l-primary"} border-l-4 rounded-lg shadow-lg w-full py-2 sm:py-4 m-2 ${darkMode && "bg-black/25"}`}
      style={{ boxShadow: "0px 0px 12px 2px rgba(0, 0, 0, 0.06)" }}
    >
      <div className="flex flex-wrap flex-col sm:flex-row sm:items-center sm:justify-between px-1 sm:px-4">
        <div className="flex flex-col p-2 sm:p-4 gap-y-2 sm:gap-y-4">
          {/* Hash */}
          <div className="flex items-center gap-x-1 sm:gap-x-2 max-w-full overflow-hidden min-w-0">
            <div
              className={`flex items-center justify-center p-2 rounded-full ${showDark ? "bg-secondary2/80" : "bg-secondary2/80"} animate-pulse`}
            >
              <div className="w-6 h-6 rounded-full"></div>
            </div>
            <div
              className={`h-5 w-48 sm:w-64 lg:w-96 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}
            ></div>
          </div>

          {/* Block No and Time */}
          <div className="flex gap-x-4">
            <div className={`h-3 w-20 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
            <div
              className={`h-3 w-16 rounded-md ${showDark ? "bg-gray-700/50" : "bg-gray-300/50"} animate-pulse`}
            ></div>
          </div>
        </div>

        {/* From and To Address */}
        <div className="flex sm:justify-center sm:items-center gap-x-2 sm:gap-x-4 p-4 text-[12px] sm:text-[16px]">
          <div className={`h-4 w-20 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
          <div className={`h-4 w-4 rounded-md ${showDark ? "bg-secondary" : "bg-primary"} animate-pulse`}></div>
          <div className={`h-4 w-20 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
        </div>

        {/* Status Buttons */}
        <div className="flex sm:justify-center items-center gap-x-4 p-4">
          <div className={`h-8 w-12 sm:w-16 rounded-lg ${showDark ? 'bg-gray-700' : 'bg-gray-300' }  animate-pulse`}></div>
          <div className={`h-8 w-12 sm:w-16 rounded-lg ${showDark ? 'bg-gray-700' : 'bg-gray-300' }  animate-pulse`}></div>
        </div>
      </div>
    </div>
  )
}

export default TransactionCardSkeleton

