'use client';

import { useState, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

const FormDropdown = ({
  name,
  control,
  label,
  badgeText = null,
  badgeVariant = 'secondary',
  helperIcon = false,
  disabled = false,
  placeholder = 'Select option',
  className = '',
  options = [],
  rules = {},
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div className="relative space-y-1">
      {label && (
        <label htmlFor={name} className="flex items-center gap-1 text-sm font-medium">
          {badgeText && (
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                badgeVariant === 'secondary'
                  ? 'bg-gray-200 text-gray-800'
                  : badgeVariant === 'success'
                  ? 'bg-green-100 text-green-800'
                  : badgeVariant === 'danger'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {badgeText}
            </span>
          )}
          {label}
          {helperIcon && <span className="text-blue-500">ⓘ</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <div
              className={`relative h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 ${
                disabled ? 'cursor-not-allowed bg-gray-100' : ''
              } ${className}`}
              onClick={() => !disabled && setOpen((prev) => !prev)}
            >
              <span className={`${field.value ? 'text-gray-900' : 'text-gray-400'}`}>
                {options.find((opt) => opt.value === field.value)?.label || placeholder}
              </span>
              <ChevronDown size={18} className="text-gray-500" />
            </div>

            {open && !disabled && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 text-sm border-b border-gray-200 outline-none h-9 focus:ring-0"
                />
                <ul className="overflow-y-auto max-h-40">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <li
                        key={opt.value}
                        onClick={() => {
                          field.onChange(opt.value);
                          setOpen(false);
                          setSearch('');
                        }}
                        className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 ${
                          field.value === opt.value ? 'bg-blue-100 text-blue-700 font-medium' : ''
                        }`}
                      >
                        {opt.label}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-500">No results</li>
                  )}
                </ul>
              </div>
            )}

            {fieldState.error && (
              <p className="text-xs text-red-500">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FormDropdown;
