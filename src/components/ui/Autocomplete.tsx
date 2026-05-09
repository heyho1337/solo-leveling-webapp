'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export type AutocompleteItem = {
  id: string;
  label: string;
  description?: string;
};

interface AutocompleteProps {
  label: string;
  items: AutocompleteItem[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  noResultsLabel?: string;
}

export function Autocomplete({
  label,
  items,
  value,
  onChange,
  placeholder = 'Search…',
  multiple = false,
  required = false,
  disabled = false,
  className = '',
  noResultsLabel = 'No results found',
}: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedIds = useMemo(
    () =>
      multiple
        ? (value as string[]).map((id) => String(id))
        : value
          ? [String(value as string)]
          : [],
    [multiple, value],
  );
  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(String(item.id))),
    [items, selectedIds],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) =>
      normalizedQuery.length === 0
        ? true
        : item.label.toLowerCase().includes(normalizedQuery) || item.description?.toLowerCase().includes(normalizedQuery)
    );
  }, [items, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (itemId: string) => {
    if (disabled) return;
    const id = String(itemId);
    if (multiple) {
      const values = (value as string[]).map(String);
      if (values.includes(id)) {
        onChange(values.filter((v) => v !== id));
      } else {
        onChange([...values, id]);
      }
      setQuery('');
      setIsOpen(true);
      return;
    }

    onChange(id);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = (itemId?: string) => {
    if (disabled) return;
    if (multiple) {
      const rm = String(itemId);
      onChange((value as string[]).map(String).filter((v) => v !== rm));
    } else {
      onChange('');
    }
  };

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8]">
          {label}
          {required ? <span className="text-white/50"> *</span> : null}
        </label>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white"
            >
              <span>{item.label}</span>
              <button
                type="button"
                onClick={() => handleClear(item.id)}
                className="rounded-full p-1 text-white/60 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Input
          required={required && !selectedItems.length}
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          className="pr-10"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {isOpen && (
        <div className="max-h-64 overflow-y-auto rounded border border-white/10 bg-black/90 shadow-xl">
          {filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-[10px] text-white/50">{noResultsLabel}</div>
          ) : (
            filteredItems.map((item) => {
              const active = selectedIds.includes(String(item.id));
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelect(String(item.id))}
                  className={`w-full px-3 py-3 text-left text-[10px] uppercase tracking-[0.3em] transition ${
                    active ? 'bg-[#38bdf8]/10 text-[#38bdf8]' : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{item.label}</span>
                    {active && <span className="text-[8px] border border-[#38bdf8] px-2 py-0.5 rounded-sm bg-[#38bdf8]/20">SELECTED</span>}
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-[9px] text-white/40">{item.description}</p>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
