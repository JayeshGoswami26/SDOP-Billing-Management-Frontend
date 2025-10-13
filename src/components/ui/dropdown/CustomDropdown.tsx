import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
  label?: string;
  error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  isMulti = false,
  isSearchable = false,
  disabled = false,
  className = "",
  maxHeight = "200px",
  label,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleOptionClick(filteredOptions[focusedIndex].value);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [focusedIndex]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleOptionClick = (optionValue: string) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Remove selected option (multi-select)
  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(value)) {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  // Get display value
  const getDisplayValue = () => {
    if (isMulti && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selected` : placeholder;
    } else if (!isMulti && value) {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
    return placeholder;
  };

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (isMulti && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      
      {/* Selected values display for multi-select with glass effect */}
      {isMulti && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map(val => {
            const option = options.find(opt => opt.value === val);
            return option ? (
              <span
                key={val}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium transition-all duration-200 hover:bg-indigo-200/80 dark:hover:bg-indigo-800/40"
              >
                {option.label}
                <button
                  onClick={(e) => removeOption(val, e)}
                  className="ml-2 hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors duration-150 hover:scale-110"
                >
                  <X size={14} />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2 bg-[#e8edf2]
          border border-input rounded-md
          text-foreground cursor-pointer
          outline-none ring-0
          flex items-center justify-between
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/60'}
          ${error ? 'border-red-500' : ''}
          ${isOpen ? 'border-primary' : ''}
        `}
      >
        <span className={`${
          value ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {getDisplayValue()}
        </span>
        <ChevronDown
          size={18}
          className={`text-muted-foreground ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-99999 w-full mt-2 bg-[#e8edf2] border border-input rounded-md shadow-lg overflow-hidden"
          style={{ maxHeight }}
        >
          {isSearchable && (
            <div className="p-2 border-b border-input">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-input rounded-md text-sm focus:border-primary outline-none"
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                <Search size={20} className="mx-auto mb-2 opacity-60" />
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => { optionRefs.current[index] = el || null; }}
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    px-3 py-2 cursor-pointer flex items-center justify-between text-sm
                    ${focusedIndex === index ? 'bg-white' : ''}
                    ${isSelected(option.value)
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                      : 'hover:bg-white'}
                  `}
                >
                  <span className="flex-1">{option.label}</span>
                  {isSelected(option.value) && (
                    <Check 
                      size={16} 
                      className="text-indigo-600 dark:text-indigo-400" 
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error message with enhanced styling */}
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 font-medium animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;
