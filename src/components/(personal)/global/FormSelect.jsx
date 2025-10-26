'use client';

import { useState, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

const FormSelect = ({ name, control, label, options = [], isSearch = false, disabled = false, placeholder = 'Select an option', className = '', rules = {} }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={wrapperRef}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => {
                    const selectedOption = options.find((opt) => opt.value === field.value);

                    const filteredOptions = isSearch ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())) : options;

                    return (
                        <div className="relative">
                            <div
                                onClick={() => !disabled && setOpen((prev) => !prev)}
                                className={`flex h-10 w-full items-center justify-between rounded-lg border-2 border-gray-200 px-3 text-sm transition-colors ${
                                    disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'cursor-pointer hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'
                                } ${className}`}
                            >
                                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                            </div>

                            {open && (
                                <div className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60">
                                    {isSearch && (
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full px-2 py-1 text-sm border rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                                            />
                                        </div>
                                    )}

                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt) => (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    field.onChange(opt.value);
                                                    setOpen(false);
                                                    setSearch('');
                                                }}
                                                className={`cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-blue-50 ${field.value === opt.value ? 'bg-blue-100 font-medium' : ''}`}
                                            >
                                                {opt.label}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">No results</div>
                                    )}
                                </div>
                            )}

                            {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default FormSelect;
