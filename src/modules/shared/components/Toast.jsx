function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="font-medium text-sm sm:text-base">{message}</span>
      </div>
    </div>
  );
}

export default Toast;