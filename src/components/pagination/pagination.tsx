// 'use client'
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import images from "../../data/images.json"
// import { useDarkMode } from "../../app/context/DarkModeContext";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//   const { darkMode } = useDarkMode(); // Get dark mode state
//   const [showDark, setShowDark] = useState(darkMode);

//   useEffect(() => {
//     // Delay state update slightly to enable smooth transition
//     const timeout = setTimeout(() => setShowDark(darkMode), 100);
//     return () => clearTimeout(timeout);
//   }, [darkMode]);


//   return (
//     <div className="flex items-center justify-center space-x-1 sm:space-x-4 mt-4">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="p-1 border border-black/25 rounded-full disabled:opacity-50 min-w-5 max-w-10 cursor-pointer"
//       >
//         <Image src={showDark ? images.leftArrowDark : images.leftArrowLight} alt="left-arrow" width={20} height={20}
//           className="w-4 h-4 min-w-[16px] min-h-[16px] sm:w-5 sm:h-5 md:w-6 md:h-6" />
//       </button>
//       <p className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
//         Page {currentPage}
//       </p>

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="p-1 border border-black/25 rounded-full disabled:opacity-50 min-w-5 max-w-10 cursor-pointer"
//       >
//         <Image src={showDark ? images.rightArrowDark : images.rightArrowLight} alt="right-arrow" width={20} height={20}
//           className="w-4 h-4 min-w-[16px] min-h-[16px] sm:w-5 sm:h-5 md:w-6 md:h-6" />
//       </button>
//     </div>
//   );
// };

// export default Pagination;
