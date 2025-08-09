import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type,
      ...rest
    },
    ref
  ) => {

    const baseClasses = `${className} w-full h-11 border-2 border-green-300 rounded-md bg-white px-3 text-base focus:outline-none focus:ring-1 focus:ring-green-300`;
    const dateClasses = type === 'date' ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1' : '';

    return (
      <input
        ref={ref}
        type={type}
        className={`${baseClasses} ${dateClasses}`}
        {...rest}
      />
    );
  }
);

export default Input;