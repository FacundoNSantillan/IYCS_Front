import { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLabel = options.find(opt => opt.value === value)?.label || "Seleccionar";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full sm:w-48 
          h-10 sm:h-11 
          px-3 
          border border-gray-300 rounded-lg 
          bg-white 
          flex items-center justify-between 
          text-gray-700 text-base
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
          transition-shadow
        `}
      >
        <span className="truncate">{currentLabel}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                px-4 py-2 text-sm cursor-pointer hover:bg-purple-50 transition-colors
                ${value === option.value ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'}
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;