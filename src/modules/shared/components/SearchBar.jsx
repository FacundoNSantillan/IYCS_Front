import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Buscar...', initialValue = '', className = '' }) => {
  const [localTerm, setLocalTerm] = useState(initialValue);

  const handleTrigger = () => {
    if (onSearch) {
      onSearch(localTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTrigger();
    }
  };

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      <input
        type="text"
        value={localTerm}
        onChange={(e) => setLocalTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 min-w-0 h-10 sm:h-11 text-base sm:text-[1.3rem] border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
      />
      
      <button 
        type="button"
        onClick={handleTrigger}
        className='h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors' 
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier"> 
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
          </g>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;