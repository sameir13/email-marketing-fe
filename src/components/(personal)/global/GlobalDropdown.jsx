'use client';

import { useSelector } from 'react-redux';
import Dropdown from '../../dropdown';
import { useState } from 'react';

const GlobalDropdown = ({
    buttonLabel = 'Action',
    buttonIcon = null,
    btnClassName = 'dropdown-toggle border border-gray-200 rounded-md px-3 py-2',
    options = [],
    onSelect,
    placement,
    icon,
    optionClassName = '',
    listClassName = '!min-w-[170px]',
}) => {
    const isRtl = useSelector((state) => state.themeConfig.rtlClass) === 'rtl';
    const [selectedValue, setselectedValue] = useState(null);

    return (
        <div className="dropdown">
            <Dropdown
                placement={placement ?? (isRtl ? 'bottom-start' : 'bottom-end')}
                btnClassName={btnClassName}
                button={
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        {icon}
                        {buttonLabel}
                        {buttonIcon && <span>{buttonIcon}</span>}
                    </div>
                }
            >
                
                <ul className={`${listClassName} flex flex-col max-w-[400px] max-h-[300px] overflow-y-auto`}>
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition ${optionClassName} ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${selectedValue === opt?.value && 'bg-gray-100'}`}
                                disabled={opt.disabled}
                                onClick={() => {
                                    !opt.disabled && onSelect?.(opt.value);
                                    setselectedValue(opt.value);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {opt.icon && <span>{opt.icon}</span>}
                                    {opt.label}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

            </Dropdown>
        </div>
    );
};

export default GlobalDropdown;
