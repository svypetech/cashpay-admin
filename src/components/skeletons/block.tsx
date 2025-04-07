"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../app/context/DarkModeContext"

const BlockCardSkeleton: React.FC = () => {
  const { darkMode } = useDarkMode()
  const [showDark, setShowDark] = useState(darkMode)

  useEffect(() => {
    // Delay state update slightly to enable smooth transition
    const timeout = setTimeout(() => setShowDark(darkMode), 100)
    return () => clearTimeout(timeout)
  }, [darkMode])

  return (
    <div
      className={`flex-1 border-l ${showDark ? "border-l-secondary" : "border-l-primary"} border-l-4 rounded-lg shadow-lg w-full ${darkMode && "bg-black/25"}`}
      style={{ boxShadow: "0px 0px 12px 2px rgba(0, 0, 0, 0.06)" }}
    >
      <div className="flex flex-wrap items-center gap-x-2 p-4">
        <div
          className={`flex items-center justify-center p-2 rounded-full ${showDark ? "bg-secondary2/80" : "bg-secondary2/80"} animate-pulse`}
        >
          <div className="w-6 h-6 rounded-full"></div>
        </div>
        <div className={`h-5 w-24 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
      </div>
      <div className="flex items-center bg-black/4 gap-x-6 p-4">
        <div className={`h-3 w-28 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
        <div className={`h-3 w-20 rounded-md ${showDark ? "bg-gray-700" : "bg-gray-300"} animate-pulse`}></div>
      </div>
    </div>
  )
}

export default BlockCardSkeleton

