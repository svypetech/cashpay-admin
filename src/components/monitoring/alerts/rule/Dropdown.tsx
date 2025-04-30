
export const  CustomDropdown = ({ 
    value,
    options, 
    onChange, 
    isOpen, 
    toggleOpen, 
    register 
  }: { 
    value: string;
    options: string[];
    onChange: (value: string) => void;
    isOpen: boolean;
    toggleOpen: () => void;
    register?: any;
  }) => (
    <div className="relative">
      <input type="hidden" {...register} />
      <div 
        className="w-full p-3 border-b border-gray-300 flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <span>{value}</span>
        <img 
          src="/icons/dropdownIcon.svg" 
          alt="Dropdown" 
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-md">
          {options.map((option) => (
            <div 
              key={option} 
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                toggleOpen();
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  export default CustomDropdown;