'use client';

import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  placeholder,
  disabled = false,
}: NumberInputProps) {
  const [input, setInput] = useState(String(value));

  useEffect(() => {
    setInput(String(value));
  }, [value]);

  const handleChange = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInput(inputValue);

    if (inputValue === '' || inputValue === '-') {
      return;
    }

    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (input === '' || input === '-') {
      setInput(String(min));
      onChange(min);
    }
  };

  const increment = () => handleChange(Math.min(value + step, max));
  const decrement = () => handleChange(Math.max(value - step, min));

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm overflow-hidden">
        <button
          onClick={decrement}
          disabled={disabled || value <= min}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Minus className="h-4 w-4 text-white/60" />
        </button>
        <input
          type="number"
          value={input}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-center font-bold outline-none py-2 px-1 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        />
        <button
          onClick={increment}
          disabled={disabled || value >= max}
          className="p-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          <Plus className="h-4 w-4 text-white/60" />
        </button>
      </div>
    </div>
  );
}
