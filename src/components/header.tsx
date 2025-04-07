"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "../app/context/DarkModeContext"; // Import context hook
import { Bell, Menu } from "lucide-react"

export default function Navbar() {
  const { darkMode } = useDarkMode() // Get dark mode state from context
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
            src={darkMode ? "/images/darkModeLogo.svg" : "/images/logo.svg"}
            alt="logo"
            height={34}
            width={152}
          />
      </Link>

      <div className="flex items-center gap-4 md:hidden">
        <button aria-label="Notifications" className="relative p-1 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
              src="/images/user-avatar.png"
              alt="Profile picture"
              width={32}
              height={32}
              className="bg-amber-500"
            />
          </div>
          <span className="text-sm font-medium">John Doe</span>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-2 sm:gap-6">
        <button aria-label="Notifications" className="relative p-1 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-500" />
        </button>

        <div className="relative bg-gray-100 rounded-xl py-2 px-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image
                src="/images/user-avatar.png"
                alt="Profile picture"
                width={32}
                height={32}
                className="bg-amber-500"
              />
            </div>
            <span className="text-sm font-medium">John Doe</span>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <Menu className="h-5 w-5 text-gray-500 ml-1" />
            )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute top-10 right-0 w-48 bg-white rounded-md shadow-lg py-3 px-4 z-10 border border-gray-100">
              <div className="space-y-3">
                <Link href="/forgot-password" className="block text-sm text-blue-500 hover:underline">
                  Forgot Password
                </Link>
                <Link href="/logout" className="block text-sm text-red-500 hover:underline">
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User dropdown menu */}
      {isMenuOpen && (
        <div className="absolute top-14 right-4 w-48 bg-white rounded-md shadow-lg py-3 px-4 z-10 border border-gray-100 md:hidden">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <Link href="/forgot-password" className="block text-sm text-blue-500 hover:underline">
              Forgot Password
            </Link>
            <Link href="/logout" className="block text-sm text-red-500 hover:underline">
              Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}



// const Header: React.FC = () => {
//   const { darkMode, setDarkMode } = useDarkMode(); // Get dark mode state from context
//   const [showHeader, setShowHeader] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [showTransactionDropdown, setShowTransactionDropdown] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const transactionDropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         // Delay to let the onClick event finish first
//         setTimeout(() => setShowDropdown(false), 0);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (transactionDropdownRef.current && !transactionDropdownRef.current.contains(event.target as Node)) {
//         // Delay to let the onClick event finish first
//         setTimeout(() => setShowTransactionDropdown(false), 0);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);


//   useEffect(() => {
//     if (darkMode === null) return; // Prevent running before darkMode is loaded
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("theme", newMode ? "dark" : "light");
//   };

//   return (
//     <div className={`sticky top-0 left-0 w-full z-50 ${darkMode ? "bg-darkBg" : "bg-white"} flex flex-col sm:flex-row sm:justify-between items-between sm:items-center p-3 px-8 md:px-14 shadow-[0_0_10px_1px_rgba(0,0,0,0.6)] transition-all duration-300`}>
//       {/* Logo */}
//       <div className="flex gap-x-10 justify-between items-center">
//         <Image
//           src={darkMode ? "/images/darkModeLogo.svg" : "/images/logo.svg"}
//           alt="logo"
//           height={34}
//           width={152}
//         />

//         <Image
//           className="block sm:hidden cursor-pointer" // Visible on small screens, hidden on sm and larger
//           src={showHeader ? darkMode ? images.cancelDark : images.cancelLight : darkMode ? images.headerDark : images.headerLight}
//           onClick={() => setShowHeader(prev => !prev)}
//           alt="logo"
//           height={showHeader ? 42 : 16}
//           width={showHeader ? 42 : 24}
//         />
//       </div>