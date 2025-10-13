import React from "react";
import "./toggleButtonStyle.css"; 

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  id = "play-pause-toggle",
  disabled = false,
}) => {
  return (
    <div className={`play-toggle-wrapper w-[100px] h-[50px] rounded-full scale-[0.5] ${disabled ? 'opacity-60 ' : ''}`}>
      <input
        id={id}
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`toggle-label  relative inline-block p-[6px] w-full h-full bg-white dark:bg-white/[0.3] rounded-full shadow-lg box-content ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} `}
      >
        <div className="cont-label-play relative w-[50px] aspect-square bg-[#5e5e5e] dark:bg-white/[0.5] rounded-full transition-all duration-500 ease-[cubic-bezier(1,0,0,1)] peer-checked:bg-rose-500 peer-checked:translate-x-[50px]">
          <span className="label-play absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] inline-block w-[24px] aspect-square bg-[#fefefe] rounded-[4px] transition-all duration-500 ease-[cubic-bezier(1,0,0,1)]"></span>
        </div>
      </label>
    </div>
  );
};

export default ToggleButton;
