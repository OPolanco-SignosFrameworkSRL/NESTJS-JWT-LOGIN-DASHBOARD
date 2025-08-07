import React from "react";

type InputProps = {
  defaultValue?: string;
  options?: { value: string; label: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  placeholder?: string;
  className?: string;
};

const Select = React.forwardRef<HTMLSelectElement, InputProps>(
  (
    {
      defaultValue,
      options = [],
      onChange,
      value,
      className,
      placeholder,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={`${className} border-2 border-green-300 rounded-md p-2 w-full bg-white appearance-none pr-8 focus:outline-none focus:ring-1 focus:ring-green-300`}
          defaultValue={defaultValue}
        >
         
          <option>{placeholder}</option>
   
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }
);

export default Select;