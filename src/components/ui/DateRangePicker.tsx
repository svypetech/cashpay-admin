"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange?: (start?: Date, end?: Date) => void;
  placeholder?: string;
  className?: string;
  updateUrl?: boolean;
}

// Custom Calendar Icon
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
    />
  </svg>
);

// Custom ChevronLeft Icon
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

// Custom ChevronRight Icon
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export default function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  placeholder = "Pick a date range",
  className = "",
  updateUrl = true,
}: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ from: startDate, to: endDate });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update internal state when props change
  useEffect(() => {
    setSelectedRange({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  // Initialize from URL parameters on component mount
  useEffect(() => {
    if (updateUrl && !startDate && !endDate) {
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');
      
      let initialStart: Date | undefined;
      let initialEnd: Date | undefined;
      
      if (startDateParam) {
        const start = new Date(startDateParam);
        if (!isNaN(start.getTime())) {
          initialStart = start;
        }
      }
      
      if (endDateParam) {
        const end = new Date(endDateParam);
        if (!isNaN(end.getTime())) {
          initialEnd = end;
        }
      }
      
      if (initialStart || initialEnd) {
        setSelectedRange({ from: initialStart, to: initialEnd });
        onDateChange?.(initialStart, initialEnd);
      }
    }
  }, [updateUrl, onDateChange, searchParams, startDate, endDate]);
  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectionMode(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get display text
  const getDisplayText = () => {
    if (selectedRange.from && selectedRange.to) {
      return `${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`;
    } else if (selectedRange.from) {
      return `From ${formatDate(selectedRange.from)}`;
    } else if (selectedRange.to) {
      return `Until ${formatDate(selectedRange.to)}`;
    }
    return placeholder;
  };

  // Generate calendar days
  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    
    let newStart = selectedRange.from;
    let newEnd = selectedRange.to;
    
    if (selectionMode === 'start') {
      newStart = newDate;
      // If end date exists and new start is after end, clear end date
      if (newEnd && newDate > newEnd) {
        newEnd = undefined;
      }
      setSelectionMode(null);
    } else if (selectionMode === 'end') {
      newEnd = newDate;
      // If start date exists and new end is before start, clear start date
      if (newStart && newDate < newStart) {
        newStart = undefined;
      }
      setSelectionMode(null);
    }
    
    setSelectedRange({ from: newStart, to: newEnd });
    onDateChange?.(newStart, newEnd);
  };

  // Handle start date selection
  const handleSelectStartDate = () => {
    setSelectionMode('start');
  };

  // Handle end date selection
  const handleSelectEndDate = () => {
    setSelectionMode('end');
  };

  // Handle clear action
  const handleClear = () => {
    setSelectedRange({ from: undefined, to: undefined });
    onDateChange?.(undefined, undefined);
    setSelectionMode(null);
  };

  // Check if date is in range
  const isDateInRange = (date: Date) => {
    if (!selectedRange.from || !selectedRange.to) return false;
    
    const start = selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to;
    const end = selectedRange.from < selectedRange.to ? selectedRange.to : selectedRange.from;
    
    return date >= start && date <= end;
  };

  // Check if date is start or end of range
  const isDateRangeStart = (date: Date) => {
    return selectedRange.from && date.getTime() === selectedRange.from.getTime();
  };

  const isDateRangeEnd = (date: Date) => {
    return selectedRange.to && date.getTime() === selectedRange.to.getTime();
  };

  // Navigation
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const calendarDays = generateCalendarDays(currentMonth);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full cursor-pointer flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 ${className}`}>
        {getDisplayText().trim() ? <span>{getDisplayText()}</span> : <span>Filter</span>}
        <Image
          src="/icons/calendar.svg"
          alt="Calendar"
          width={24}
          height={24}
        />
      </button>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 min-w-[320px]"
        >
          {/* Selection Mode Indicator */}
          {selectionMode && (
            <div className="mb-3 p-2 bg-blue-50 rounded-md text-center">
              <p className="text-sm text-primary font-medium">
                {selectionMode === 'start' ? 'Select Start Date' : 'Select End Date'}
              </p>
            </div>
          )}

          {/* Selected Dates Display */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Start: </span>
                <span className="font-medium">
                  {selectedRange.from ? formatDate(selectedRange.from) : 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">End: </span>
                <span className="font-medium">
                  {selectedRange.to ? formatDate(selectedRange.to) : 'Not selected'}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-xs text-gray-500 text-center py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected = isDateRangeStart(date) || isDateRangeEnd(date);
              const isInRange = isDateInRange(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!selectionMode}
                  className={`
                    relative h-8 w-8 text-xs rounded-md transition-colors
                    ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                    ${isToday && !isSelected ? "bg-gray-100 font-semibold" : ""}
                    ${isSelected ? "bg-primary text-white font-semibold" : ""}
                    ${isInRange && !isSelected ? "bg-blue-100 text-primary" : ""}
                    ${isCurrentMonth && !isSelected && !isInRange && selectionMode ? "hover:bg-gray-100" : ""}
                    ${!selectionMode ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Date Selection Buttons */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={handleSelectStartDate}
              className={`flex-1 text-xs px-3 py-2 rounded-md font-medium transition-colors ${
                selectionMode === 'start' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Select Start Date
            </button>
            <button
              onClick={handleSelectEndDate}
              className={`flex-1 text-xs px-3 py-2 rounded-md font-medium transition-colors ${
                selectionMode === 'end' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Select End Date
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectionMode(null);
              }}
              className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:scale-105"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}