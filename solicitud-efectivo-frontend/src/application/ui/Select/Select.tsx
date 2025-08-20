import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  defaultValue?: string;
  options?: { value: number; label: string }[];
  placeholder?: string;
  className?: string;
  twMerge?: (...classes: string[]) => string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      defaultValue,
      options = [],
      onChange,
      value,
      className = "",
      placeholder,
      twMerge,
      ...rest
    },
    ref
  ) => {

    return (

      <div className="w-full relative">
          <select
            ref={ref}
            value={value}
            onChange={onChange}
            className={twMerge ? twMerge(className, "w-full h-11 border-2 border-green-300 rounded-md bg-white px-3 text-base appearance-none pr-10 focus:outline-none focus:ring-1 focus:ring-green-300") : `${className} w-full h-11 border-2 border-green-300 rounded-md bg-white px-3 text-base appearance-none pr-10 focus:outline-none focus:ring-1 focus:ring-green-300`}
            defaultValue={defaultValue}
            {...rest}
          >
          
            <option value="">{placeholder}</option>
      
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