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


    return (
      <input
        type={type}
        onChange={onChange}
        value={value}
        className={`${className} border-2 border-green-300 rounded-md p-2 w-full bg-white`}
        placeholder={placeholder}
        ref={ref}
        defaultValue={defaultValue} 
      />
    );
  }
);

export default Input;