import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value ? : string;
  className ?: string
}

const InputField = ({
  label,
  type,
  placeholder,
  id,
  name,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="text-lg font-semibold text-gray-600 dark:text-white/80 mb-2 block"
      >
        {label}
      </label>

      <div className="flex rounded-2xl overflow-hidden bg-gray-200/70 dark:bg-white/[0.03] h-14">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className="flex-1 bg-transparent border-0 px-4 text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none"
          
        />
      </div>
    </div>
  );
};

export default InputField;
