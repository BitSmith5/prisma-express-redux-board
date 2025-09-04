import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`custom-dropdown__control ${isOpen ? 'custom-dropdown__control--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        data-status={value}
      >
        <span className="custom-dropdown__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="custom-dropdown__arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="custom-dropdown__menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-dropdown__option ${
                option.value === value ? 'custom-dropdown__option--selected' : ''
              }`}
              onClick={() => handleOptionClick(option.value)}
              data-value={option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
