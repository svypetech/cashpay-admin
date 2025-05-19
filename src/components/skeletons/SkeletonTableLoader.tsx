import React from "react";

interface SkeletonTableLoaderProps {
  headings: string[];
  rowCount?: number;
}

const SkeletonTableLoader: React.FC<SkeletonTableLoaderProps> = ({
  headings,
  rowCount = 10, // Default to 10 rows
}) => {
  return (
    <div className="flex-1 rounded-lg w-full py-5 animate-pulse">
      {/* Table with overflow container */}
      <div className="rounded-lg overflow-x-auto w-full min-h-[200px]">
        <table className="w-full text-left table-auto min-w-[600px]">
          <thead className="bg-secondary/10 sticky top-0">
            <tr className="font-satoshi text-[12px] md:text-[14px] lg:text-[16px]">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-left whitespace-nowrap"
                >
                  <div className="truncate max-w-[150px] md:max-w-none">
                    {heading}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(rowCount)
              .fill(0)
              .map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 text-[12px] md:text-[14px] lg:text-[16px]"
                >
                  {Array(headings.length)
                    .fill(0)
                    .map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-2 md:px-3 lg:px-4 py-3 md:py-4 font-satoshi"
                      >
                        {/* Different widths for skeleton items to make them look more natural */}
                        <div
                          className={`h-5 bg-gray-200 rounded ${
                            colIndex === 0
                              ? "w-1/2"
                              : colIndex === 1
                              ? "w-3/4"
                              : colIndex === headings.length - 1
                              ? "w-1/4"
                              : "w-2/3"
                          }`}
                        ></div>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonTableLoader;