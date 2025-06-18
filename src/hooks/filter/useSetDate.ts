import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const useDateRangeFilter = () => {
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Initialize from URL parameters
  useEffect(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    if (startDateParam) {
      const start = new Date(startDateParam);
      if (!isNaN(start.getTime())) {
        setStartDate(start);
      }
    }
    
    if (endDateParam) {
      const end = new Date(endDateParam);
      if (!isNaN(end.getTime())) {
        setEndDate(end);
      }
    }
  }, [searchParams]);

  const handleDateChange = (start?: Date, end?: Date) => {
    setStartDate(start);
    setEndDate(end);
    console.log("Date range changed:", {
      start: start ? start.toISOString() : undefined,
      end: end ? end.toISOString() : undefined,
    });
  };

  return {
    startDate,
    endDate,
    handleDateChange,
  };
};