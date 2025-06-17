import { useState } from "react";

export const useDateRangeFilter = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleDateChange = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    console.log("Date range changed:", {
      start: start ? start.toISOString() : undefined,
      end: end ? end.toISOString() : undefined,
    });

    // Log in ISO format
  };

  return {
    startDate,
    endDate,
    handleDateChange,
  };
};


