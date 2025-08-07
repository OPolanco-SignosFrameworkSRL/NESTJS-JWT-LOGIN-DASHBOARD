import React from "react";

type InputProps = {
  defaultValue?: string; 
  type?: "button" | "checkbox" | "radio" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "password" | "submit" | "text" | "search" | "number" | "select";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      defaultValue, 
      type,
      onChange,
      value,
      className,
      placeholder,
    },
    ref
  ) => {

    const baseClasses = `${className} border-2 border-green-300 rounded-md p-2 w-full bg-white focus:outline-none focus:ring-1 focus:ring-green-300`;
    const dateClasses = type === 'date' ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1' : '';

    return (
      <input
        type={type}
        onChange={onChange}
        value={value}
        className={`${baseClasses} ${dateClasses}`}
        placeholder={placeholder}
        ref={ref}
        defaultValue={defaultValue} 
      />
    );
  }
);

export default Input;