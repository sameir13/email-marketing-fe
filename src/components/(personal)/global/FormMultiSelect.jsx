'use client';

import { useState, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { ChevronDown, Check } from 'lucide-react';

const FormMultiSelect = ({
  name,
  control,
  label,
  badgeText = null,
  badgeVariant = 'secondary',
  helperIcon = false,
  disabled = false,
  placeholder = 'Select options',
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

  const toggleSelectAll = (fieldValue, onChange) => {
    if (fieldValue.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.value));
    }
  };

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
        render={({ field, fieldState }) => {
          const selectedValues = field.value || [];

          return (
            <>
              <div
                className={`relative h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-gray-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 ${
                  disabled ? 'cursor-not-allowed bg-gray-100' : ''
                } ${className}`}
                onClick={() => !disabled && setOpen((prev) => !prev)}
              >
                <span className={`truncate ${selectedValues.length ? 'text-gray-900' : 'text-gray-400'}`}>
                  {selectedValues.length
                    ? `${selectedValues.length} selected`
                    : placeholder}
                </span>
                <ChevronDown size={18} className="text-gray-500" />
              </div>

              {open && !disabled && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-8 text-sm outline-none focus:ring-0"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSelectAll(selectedValues, field.onChange)}
                    className="w-full px-3 py-2 text-sm text-left text-blue-600 border-b border-gray-100 hover:bg-blue-50"
                  >
                    {selectedValues.length === options.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>

                  <ul className="overflow-y-auto max-h-48">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => {
                        const selected = selectedValues.includes(opt.value);
                        return (
                          <li
                            key={opt.value}
                            onClick={() => {
                              let updated;
                              if (selected) {
                                updated = selectedValues.filter((v) => v !== opt.value);
                              } else {
                                updated = [...selectedValues, opt.value];
                              }
                              field.onChange(updated);
                            }}
                            className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 hover:bg-blue-50 ${
                              selected ? 'bg-blue-100 text-blue-700 font-medium' : ''
                            }`}
                          >
                            <span
                              className={`h-4 w-4 flex items-center justify-center border rounded ${
                                selected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
                              }`}
                            >
                              {selected && <Check size={12} />}
                            </span>
                            {opt.label}
                          </li>
                        );
                      })
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
          );
        }}
      />
    </div>
  );
};

export default FormMultiSelect;
