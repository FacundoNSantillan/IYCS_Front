function Button({ children, type = 'button', variant = 'default', className = '', ...restProps }) {
  
  const baseStyle = "font-semibold rounded transition-colors text-sm sm:text-base py-1.5 px-4 sm:py-2 sm:px-6 flex items-center justify-center";

  const variantStyle = {
    default: 'bg-purple-200 text-purple-900 hover:bg-purple-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variantStyle[variant] || variantStyle.default} ${className}`}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;