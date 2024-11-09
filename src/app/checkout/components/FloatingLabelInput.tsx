import { useState } from 'react';

const FloatingLabelInput = ({
  id,
  name,
  type,
  value,
  placeholder,
  onChange,
  error,
  required,
  getInputStyles
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative md:mb-5 max-w-[520px] w-full">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`block w-full h-[56px] px-5 pt-5 pb-2 rounded-[10px] text-[14px] font-heebo placeholder-transparent transition-all duration-200 ease-in-out ${getInputStyles(error)} 
          ${focused || value ? 'border-[#6BA3FF] bg-blue-100' : 'border-[#6F6F6F] bg-[#F9F9F9]'}
        `}
        placeholder=" "
        required={required}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 ease-in-out
          ${focused || value ? 'top-2 text-[10px] text-[#BDBDBD]' : 'top-4 text-[14px] text-[#6F6F6F]'}
        `}
      >
        {placeholder}
      </label>
      {error && (
        <span className="text-red-500 text-sm">Please enter a valid {placeholder}</span>
      )}
    </div>
  );
};

export default FloatingLabelInput;
