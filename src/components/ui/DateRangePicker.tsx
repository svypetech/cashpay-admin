// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { DateRange } from "react-day-picker";
// import { useState, useEffect } from "react";
// import { cn } from "@/src/lib/utils";
// import { Button } from "@/src/components/ui/button";
// import { Calendar } from "@/src/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/src/components/ui/popover";

// interface DateRangePickerProps {
//   startDate?: Date;
//   endDate?: Date;
//   onDateChange: (startDate?: Date, endDate?: Date) => void;
//   className?: string;
//   placeholder?: string;
// }

// export function DateRangePicker({
//   startDate,
//   endDate,
//   onDateChange,
//   className,
//   placeholder = "Filter",
// }: DateRangePickerProps) {
//   const [open, setOpen] = React.useState(false);
//   const [internalStartDate, setInternalStartDate] = useState<Date | undefined>(
//     startDate || undefined
//   );
//   const [internalEndDate, setInternalEndDate] = useState<Date | undefined>(
//     endDate || undefined
//   );

//   // Helper function to convert date to local timezone at start of day
//   const convertToLocalDate = (date: Date): Date => {
//     const localDate = new Date(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate()
//     );
//     return localDate;
//   };

//   // Update internal state when props change
//   useEffect(() => {
//     setInternalStartDate(startDate || undefined);
//     setInternalEndDate(endDate || undefined);
//   }, [startDate, endDate]);

//   // Convert internal states to DateRange for calendar
//   const dateRange: DateRange | undefined =
//     internalStartDate || internalEndDate
//       ? {
//           from: internalStartDate || undefined,
//           to: internalEndDate || undefined,
//         }
//       : undefined;

//   // Get the default month for the calendar - prioritize startDate, then endDate, then current month
//   const getDefaultMonth = (): Date => {
//     if (startDate) return startDate;
//     if (endDate) return endDate;
//     if (internalStartDate) return internalStartDate;
//     if (internalEndDate) return internalEndDate;
//     return new Date(); // Current month as fallback
//   };

//   const handleDateRangeChange = (range: DateRange | undefined) => {
//     // Convert selected dates to local dates to avoid timezone issues
//     const startDate = range?.from ? convertToLocalDate(range.from) : undefined;
//     const endDate = range?.to ? convertToLocalDate(range.to) : undefined;

//     setInternalStartDate(startDate);
//     setInternalEndDate(endDate);
//   };

//   const handleApply = () => {
//     if (internalStartDate && internalEndDate) {
//       // Keep the dates as local dates, just ensure they're at start/end of day
//       const startDate = new Date(
//         internalStartDate.getFullYear(),
//         internalStartDate.getMonth(),
//         internalStartDate.getDate(),
//         0,
//         0,
//         0,
//         0
//       );
//       const endDate = new Date(
//         internalEndDate.getFullYear(),
//         internalEndDate.getMonth(),
//         internalEndDate.getDate(),
//         23,
//         59,
//         59,
//         999
//       );

//       onDateChange(startDate, endDate);
//       setOpen(false);
//     }
//   };

//   const handleSetStartDate = () => {
//     if (internalStartDate || internalEndDate) {
//       const selectedDate = internalStartDate || internalEndDate;
//       if (selectedDate) {
//         const startDate = new Date(
//           selectedDate.getFullYear(),
//           selectedDate.getMonth(),
//           selectedDate.getDate(),
//           0,
//           0,
//           0,
//           0
//         );
//         onDateChange(startDate, undefined);
//         setOpen(false);
//       }
//     }
//   };

//   const handleSetEndDate = () => {
//     if (internalStartDate || internalEndDate) {
//       const selectedDate = internalStartDate || internalEndDate;
//       if (selectedDate) {
//         const endDate = new Date(
//           selectedDate.getFullYear(),
//           selectedDate.getMonth(),
//           selectedDate.getDate(),
//           23,
//           59,
//           59,
//           999
//         );
//         onDateChange(undefined, endDate);
//         setOpen(false);
//       }
//     }
//   };

//   const handleClear = () => {
//     setInternalStartDate(undefined);
//     setInternalEndDate(undefined);
//     onDateChange(undefined, undefined);
//     setOpen(false); // Close the calendar when clearing
//   };

//   // Handle outside click - reset dates to undefined
//   const handleOpenChange = (isOpen: boolean) => {
//     if (!isOpen) {
//       // When closing (clicking outside), reset internal dates to undefined
//       setInternalStartDate(undefined);
//       setInternalEndDate(undefined);
//       onDateChange(undefined, undefined);
//     }
//     setOpen(isOpen);
//   };

//   const formatDisplayText = () => {
//     if (!internalStartDate && !internalEndDate) {
//       return placeholder;
//     }

//     if (internalStartDate && internalEndDate) {
//       // If both dates are the same, show just one date
//       if (internalStartDate.toDateString() === internalEndDate.toDateString()) {
//         return format(internalStartDate, "MMM dd, yyyy");
//       }
//       // Show date range
//       return `${format(internalStartDate, "MMM dd")} - ${format(
//         internalEndDate,
//         "MMM dd"
//       )}`;
//     }

//     if (internalStartDate) {
//       return format(internalStartDate, "MMM dd, yyyy");
//     }

//     if (internalEndDate) {
//       return format(internalEndDate, "MMM dd, yyyy");
//     }

//     return placeholder;
//   };

//   const getDaysSelected = () => {
//     if (internalStartDate && internalEndDate) {
//       const days =
//         Math.ceil(
//           (internalEndDate.getTime() - internalStartDate.getTime()) /
//             (1000 * 60 * 60 * 24)
//         ) + 1;
//       return days;
//     }
//     return 1;
//   };

//   // Check if only one date is selected
//   const hasOnlyOneDate =
//     (internalStartDate && !internalEndDate) ||
//     (!internalStartDate && internalEndDate);
//   const hasBothDates = internalStartDate && internalEndDate;
//   const hasNoDate = !internalStartDate && !internalEndDate;

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover open={open} onOpenChange={handleOpenChange}>
//         <PopoverTrigger asChild>
//           <button className="flex justify-between items-center w-full px-4 py-2 bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
//             <span className="font-medium">{formatDisplayText()}</span>
//             <img
//               className="h-[24px] w-[24px] text-gray-500"
//               src="/icons/calendar.svg"
//               alt="Calendar"
//             />
//           </button>
//         </PopoverTrigger>
//         <PopoverContent
//           className="w-auto p-0 border border-gray-200"
//           align="start"
//         >
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={getDefaultMonth()}
//             selected={dateRange}
//             onSelect={handleDateRangeChange}
//             numberOfMonths={2}
//             className="rounded-md border border-gray-200 bg-white"
//           />
//           <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-white">
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleClear}
//                 disabled={hasNoDate}
//                 className="text-red-600 border-red-300 hover:bg-red-50"
//               >
//                 Clear
//               </Button>

//               {/* Show different buttons based on selection */}
//               {hasOnlyOneDate ? (
//                 <>
//                   <Button
//                     size="sm"
//                     onClick={handleSetStartDate}
//                     className="bg-primary hover:bg-primary/90 text-white text-xs px-2"
//                   >
//                     Set Start Date
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={handleSetEndDate}
//                     className="bg-primary hover:bg-primary/90 text-white text-xs px-2"
//                   >
//                     Set End Date
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   size="sm"
//                   onClick={handleApply}
//                   disabled={hasNoDate}
//                   className="bg-primary hover:bg-primary/90 text-white"
//                 >
//                   Apply
//                 </Button>
//               )}
//             </div>
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }