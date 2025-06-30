import React from "react";

export default function MessageListSkeleton() {
  // Generate different message types for visual variety
  const skeletonMessages = [
    { type: "received", size: "medium" }, // Other user's message
    { type: "sent", size: "large" }, // Your message
    { type: "received", size: "large" },
    { type: "sent", size: "medium" },
    { type: "received", size: "small" },
  ];

  return (
    <div className="flex-1 md:h-full overflow-y-auto p-4 space-y-8 animate-pulse">
      {/* Date header skeleton */}
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <span className="text-xs bg-gray-200 rounded w-16 h-4 px-3"></span>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      {/* Message skeletons with alternating alignment */}
      {skeletonMessages.map((message, index) => {
        // Determine width class based on message size
        // Using percentages for better responsive behavior
        const widthClass =
          message.size === "small"
            ? "w-[40%]"
            : message.size === "medium"
            ? "w-[60%]"
            : "w-[75%]";

        return (
          <div
            key={index}
            className={`flex ${
              message.type === "sent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${widthClass} max-w-[320px] rounded-lg px-4 py-4 ${
                message.type === "sent"
                  ? "bg-gray-200 rounded-tr-none"
                  : "bg-gray-200 rounded-tl-none"
              }`}
            >
              {/* Message content skeleton */}
              
              {message.size !== "small" && (
                <div className="h-3 bg-gray-300 rounded mb-3 w-full"></div>
              )}
              {message.size === "large" && (
                <div className="h-3 bg-gray-300 rounded w-[80%]"></div>
              )}

              {/* Time skeleton */}
              <div
                className={`h-3 bg-gray-300 rounded w-16 mt-3 ml-auto`}
              ></div>
            </div>
          </div>
        );
      })}

      {/* Second date header skeleton */}
      <div className="flex items-center justify-center gap-2 py-2 mt-8">
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
        <span className="text-xs bg-gray-200 rounded w-16 h-4 px-3"></span>
        <div className="h-[1px] bg-gray-200 flex-grow"></div>
      </div>

      {/* More message skeletons */}
      {[...skeletonMessages].reverse().map((message, index) => {
        // Using the same width pattern for consistency
        const widthClass =
          message.size === "small"
            ? "w-[40%]"
            : message.size === "medium"
            ? "w-[60%]"
            : "w-[75%]";

        return (
          <div
            key={`second-${index}`}
            className={`flex ${
              message.type === "sent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${widthClass} max-w-[320px] rounded-lg px-4 py-4 ${
                message.type === "sent"
                  ? "bg-gray-200 rounded-tr-none"
                  : "bg-gray-200 rounded-tl-none"
              }`}
            >
              <div className="h-4 bg-gray-300 rounded mb-3"></div>
              {message.size !== "small" && (
                <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
              )}
              {message.size === "large" && (
                <div className="h-4 bg-gray-300 rounded w-[80%]"></div>
              )}
              <div
                className={`h-3 bg-gray-300 rounded w-16 mt-3 ml-auto`}
              ></div>
            </div>
          </div>
        );
      })}

      {/* Empty space at bottom for scrolling */}
      <div className="h-8"></div>
    </div>
  );
}
