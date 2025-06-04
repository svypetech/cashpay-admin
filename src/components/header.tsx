"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDarkMode } from "../app/context/DarkModeContext"; 
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { darkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setImage(parsedUserInfo.image);
      setName(parsedUserInfo.name);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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

      <div className="flex items-center gap-2 sm:gap-6">
        <div ref={dropdownRef} className="relative bg-gray-100 rounded-t-xl py-2 px-4 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <img
                src={image ? image : "/images/blank-profile.webp"}
                alt="Profile picture"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-sm font-medium">{name}</span>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary ml-2 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <Menu className="h-5 w-5 text-primary ml-2 cursor-pointer" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="absolute top-10 right-0 w-full bg-white rounded-b-xl shadow-lg py-3 px-4 z-10 border border-gray-100 font-[satoshi]">
              <div className="space-y-2">
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  href="/settings"
                  className="px-2 block text-sm text-primary font-bold cursor-pointer border-b border-gray-200 pb-2"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    localStorage.removeItem("userInfo");
                    router.push("/signin");
                  }}
                  className="px-2 block text-sm text-[#DF1D1D] font-bold cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}