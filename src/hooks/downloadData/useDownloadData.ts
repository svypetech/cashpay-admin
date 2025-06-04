import { useState } from "react";

interface useDownloadProps {
  filename?: string;
  dateInFilename?: boolean;
}

interface CSVField {
  key: string;
  label: string;
  transform?: (value: any) => string;
}

export const useDownloadData = ({ filename = "data", dateInFilename = true }: useDownloadProps = {}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Convert data to CSV format
  const convertToCSV = (data: any[], fields: CSVField[]) => {
    if (!data || data.length === 0) return "";

    // Create headers from field labels
    const headers = fields.map(field => field.label).join(",");

    // Create data rows
    const rows = data.map((item) => {
      return fields
        .map((field) => {
          // Get value from item using the key
          let value = item[field.key];
          
          // Apply transformation if provided
          if (field.transform && value !== undefined && value !== null) {
            value = field.transform(value);
          }
          
          // Handle null/undefined values
          if (value === undefined || value === null) {
            value = "N/A";
          }
          
          // Wrap in quotes and escape any existing quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    return [headers, ...rows].join("\n");
  };

  // Download CSV file
  const downloadCSV = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    }
  };

  // Main download function
  const downloadData = async (data: any[], fields: CSVField[], customFilename?: string) => {
    try {
      setIsDownloading(true);

      // Check if there's data
      if (!data || data.length === 0) {
        throw new Error("No data available to download");
      }

      // Convert to CSV
      const csvContent = convertToCSV(data, fields);

      // Generate filename
      let finalFilename = customFilename || filename;
      
      if (dateInFilename) {
        const dateString = new Date().toISOString().split("T")[0];
        finalFilename = `${finalFilename}_${dateString}`;
      }
      
      if (!finalFilename.endsWith('.csv')) {
        finalFilename += '.csv';
      }

      // Download the file
      downloadCSV(csvContent, finalFilename);
      
      return { success: true };
    } catch (error) {
      console.error("Download failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Download failed" 
      };
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadData,
    isDownloading,
  };
};