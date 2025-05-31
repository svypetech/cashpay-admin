"use client";

import React, { useState, useRef } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { shortenAddress } from "@/src/lib/functions";

interface ExpandableIdProps {
  id: string;
  className?: string;
}

const ExpandableId: React.FC<ExpandableIdProps> = ({ id, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hover events with delay for better UX
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Add delay before hiding to allow movement to tooltip
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  // Copy to clipboard function
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="cursor-pointer">{shortenAddress(id)}</span>

      {isExpanded && (
        <div
          className="absolute left-0 top-full mt-1 z-20 min-w-[280px] max-w-[400px] py-2 px-3 bg-white border border-gray-200 rounded-md shadow-md text-xs break-all"
          onMouseEnter={handleMouseEnter} // Keep expanded when hovering over tooltip
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between">
            <span className="mr-2 flex-1">{id}</span>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckIcon size={14} className="text-green-500" />
              ) : (
                <CopyIcon size={14} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableId;