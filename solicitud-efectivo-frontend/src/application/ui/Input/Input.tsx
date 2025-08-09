import React from "react";

type InputProps = (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>) & {
  className?: string;
  type?: string;
};

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className = "",
      type,
      ...rest
    },
    ref
  ) => {

    const baseClasses = `${className} w-full border-2 border-green-300 rounded-md bg-white px-3 text-base focus:outline-none focus:ring-1 focus:ring-green-300`;
    const dateClasses = type === 'date' ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1' : '';
    
    if (type === 'textarea') {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`${baseClasses} h-24 py-3 resize-none`}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        className={`${baseClasses} h-11 ${dateClasses}`}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  }
);

export default Input;