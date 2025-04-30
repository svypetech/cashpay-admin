"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import ColourfulBlock from "../ui/ColourfulBlock"
import { getStatusColors } from "@/src/components/utils/GetBlockColor"

interface User {
  ticketId: string
  userId: string
  
  issueType: string
  priority: string
  status: string
  dateCreated: string
  chat: string

}

interface Props {
  headings: string[]
  data: User[]
  onChatClick?: (supportRequest: any) => void
}

const UserTable: React.FC<Props> = ({ data, headings, onChatClick }) => {
   
  
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  
  const tableRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([])
  
  useEffect(() => {
    // Close dropdown when clicking outside
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

  useEffect(() => {
    // Adjust dropdown position for the last few rows
    if (activeDropdown !== null && tableRef.current && dropdownRefs.current[activeDropdown]) {
      const tableRect = tableRef.current.getBoundingClientRect()
      const dropdownRect = dropdownRefs.current[activeDropdown]!.getBoundingClientRect()
      const rowElement = dropdownRefs.current[activeDropdown]!.closest("tr")
      const rowRect = rowElement?.getBoundingClientRect()

      if (rowRect && dropdownRect) {
        const spaceBelow = tableRect.bottom - rowRect.bottom
        const dropdownHeight = dropdownRect.height

        // If there's not enough space below, open the dropdown upwards
        if (spaceBelow < dropdownHeight) {
          dropdownRefs.current[activeDropdown]!.style.bottom = "100%"
          dropdownRefs.current[activeDropdown]!.style.top = "auto"
          dropdownRefs.current[activeDropdown]!.style.marginBottom = "8px"
          dropdownRefs.current[activeDropdown]!.style.marginTop = "0"
        } else {
          // Otherwise, open downwards (default)
          dropdownRefs.current[activeDropdown]!.style.top = "100%"
          dropdownRefs.current[activeDropdown]!.style.bottom = "auto"
          dropdownRefs.current[activeDropdown]!.style.marginTop = "8px"
          dropdownRefs.current[activeDropdown]!.style.marginBottom = "0"
        }
      }
    }
  }, [activeDropdown])

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-[#EFE40833] text-[#B0A700]"
      case "Medium":
        return "bg-[#EFE40833] text-[#B0A700]"
      case "Low":
        return "bg-[#EFE40833] text-[#B0A700]"
      default:
        return ""
    }
  }
 

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
        <table className="w-full text-left table-auto min-w-[800px]">
          <thead className="bg-[#27AAE11A]">
            
          <tr className="bg-secondary/10 text-[12px] sm:text-[16px]">
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[12%] whitespace-nowrap">
    {headings[0]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[10%]">
    {headings[1]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[17%]">
    {headings[2]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[15%]">
    {headings[3]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[15%]">
    {headings[4]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[18%] whitespace-nowrap">
    {headings[5]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[12%]">
    {headings[6]}
  </th>
  <th className="py-4 px-6 text-left font-[700] text-[16px] w-[9%]">
    {headings[7]}
  </th>
</tr>
            
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((supportRequest, index) => (
                <tr key={index} className="border-b-[0.5px] border-black/10 text-[12px] sm:text-[16px]">
                  <td className="py-6 px-6 min-w-[100px] break-words font-[400] text-[#333333]">{supportRequest.ticketId}</td>
                  <td className="py-6 px-6 font-bold min-w-[120px] break-words font-[400]">
                    {supportRequest.userId}
                  </td>
                  <td className="py-6 px-6 min-w-[150px] break-words font-[400] text-[#333333] whitespace-nowrap">{supportRequest.issueType}</td>
                  <td className="py-6 px-6 min-w-[100px] text-[#333333]">
                    <ColourfulBlock className={`${getPriorityColors(supportRequest.priority)} font-[600] rounded-[12px] px-[16px] py-[8px] relative left-[-12px]`} text={supportRequest.priority} />
                  </td>
                  <td className="py-6 px-6 min-w-[100px] text-[#333333]">
                    <ColourfulBlock className={`${getStatusColors(supportRequest.status)} font-[600] rounded-[12px] px-[16px] py-[8px] relative left-[-12px]`} text={supportRequest.status} />
                  </td>
                  <td className="py-6 px-6 min-w-[120px] break-words font-[400] text-[#333333] whitespace-nowrap">{supportRequest.dateCreated}</td>
                  <td className="py-6 px-6 min-w-[100px] break-words">
                    <button 
                      className="underline text-primary font-[400] cursor-pointer"
                      onClick={() => onChatClick && onChatClick(supportRequest)}
                    >
                      {supportRequest.chat}
                    </button>
                  </td>
                  <td className="py-6 px-6 min-w-[60px] text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="absolute right-0 md:relative md:right-auto cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        {/* Replace with three horizontal dots */}
                        <Image src="/icons/options.svg" alt="Dropdown" width={24} height={24} className="h-5 w-5 text-primary" />
                      </button>

                      {activeDropdown === index && (
                        <div
                          className="absolute z-10 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          {/* ...existing dropdown content... */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </div>
  )}
  export default UserTable






