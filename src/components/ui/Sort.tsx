import { useState, useRef, useEffect } from "react";

interface SortOption {
  label: string;
  value: string;
}

interface SortProps {
  className?: string;
  title: string;
  options: SortOption[];
  onSort: (value: string) => void;
  sortBy?: string;
}

export default function Sort({
  className,
  title,
  options,
  onSort,
  sortBy,
}: SortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SortOption | null>(
    sortBy ? options.find((option) => option.value === sortBy) || null : null
  );
  // Ref to the dropdown container to handle outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option: SortOption) => {
    setSelectedOption(option);
    onSort(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}} ref={dropdownRef`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center gap-2 px-4 py-2 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]"
      >
        <span>{selectedOption ? selectedOption.label : title}</span>
        <img
          src="/icons/dropdownIcon.svg"
          alt="Arrow"
          className={`min-[400px]:w-[24px] min-[400px]:h-[24px] w-[16px] h-[16px] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                selectedOption?.value === option.value
                  ? "bg-gray-50 font-medium"
                  : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}