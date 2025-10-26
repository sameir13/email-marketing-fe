'use client';

import { Controller } from 'react-hook-form';

const FormInput = ({ name, control, label, badgeText = null, badgeVariant = 'secondary', helperIcon = false, disabled = false, type = 'text', placeholder = '', className = '', rules = {} }) => {
    return (
        <div className="space-y-1">
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
                        <input
                            id={name}
                            disabled={disabled}
                            type={type}
                            placeholder={placeholder}
                            className={`h-10 w-full rounded-lg border-2 border-gray-200 px-3 text-sm outline-none transition-colors hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                        />

                        {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                    </>
                )}
            />
        </div>
    );
};

export default FormInput;
