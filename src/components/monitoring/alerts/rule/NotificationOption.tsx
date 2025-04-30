const NotificationOption = ({ 
    label, 
    isSelected, 
    onToggle 
  }: { 
    label: string;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div 
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isSelected ? "bg-primary" : "border-2 border-gray-300"
        }`}
        onClick={onToggle}
      >
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      <span className="text-lg">{label}</span>
    </label>
  );

export default NotificationOption;