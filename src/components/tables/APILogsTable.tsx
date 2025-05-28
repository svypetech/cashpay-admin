import type React from "react"
import { useEffect, useState, useRef } from "react"

import ColourfulBlock from "../ui/ColourfulBlock";
import { getStatusColors } from "@/src/components/utils/GetBlockColor";
interface APILog {
  requestID: string;
  endpoint: string;
  timestamp: string;
  status: string;
  errorMessage: string;
  ticketId?: string;
}

interface Props {
  headings: string[]
  data: APILog[]
  onChatClick?: (apiLog: APILog) => void
}

const APILogsTable: React.FC<Props> = ({ data, headings, onChatClick }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])

  // Close dropdown logic...
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

  

  

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table container with horizontal scroll */}
      <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
        {/* Fixed width table to ensure columns have proper spacing */}
        <table className="w-full text-left min-w-[900px] border-spacing-y-2">
          <thead>
            <tr className="bg-secondary/10 text-[12px] sm:text-[16px]">
              {/* Evenly distributed columns with proper spacing */}
              <th className="p-4 text-left font-[700] text-[16px] w-[15%]">
                {headings[0]}
              </th>
              <th className="p-4 text-left font-[700] text-[16px] w-[22%]">
                {headings[1]}
              </th>
              <th className="p-4 text-left font-[700] text-[16px] w-[23%]">
                {headings[2]}
              </th>
              <th className="p-4 text-left font-[700] text-[16px] w-[20%]">
                {headings[3]}
              </th>
              <th className="p-4 text-left font-[700] text-[16px] w-[20%]">
                {headings[4]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((apiLog, index) => (
                <tr key={index} className="border-b border-gray-200">
                  {/* Request ID */}
                  <td className="py-4 px-4 font-[400] text-secondaryText">
                    {apiLog.requestID}
                  </td>
                  
                  {/* Endpoint */}
                  <td className="py-4 px-4 font-[400]">
                    <span 
                      className="bg-secondary/10 text-primary px-4 py-2  inline-block text-[12px] max-w-fit"
                      style={{ fontFamily: '"Lucida Console", Monaco, monospace' }}
                    >
                      {apiLog.endpoint}
                    </span>
                  </td>
                  
                  {/* Timestamp */}
                  <td className="py-4 px-4 font-[400] text-[16px] text-secondaryText whitespace-nowrap">
                    {apiLog.timestamp}
                  </td>
                  
                  {/* Status */}
                  <td className="py-4 px-4">
                    <ColourfulBlock 
                      className={`${getStatusColors(apiLog.status)}  rounded-[12px] px-4 py-1 text-center relative left-[-5px] `} 
                      text={apiLog.status} 
                    />
                  </td>
                  
                  {/* Error Message */}
                  <td className="py-4 px-4 font-[400] text-[16px] text-secondaryText whitespace-nowrap">
                    {apiLog.errorMessage}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default APILogsTable;