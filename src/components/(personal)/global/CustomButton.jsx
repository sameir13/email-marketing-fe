'use client';
import React from 'react';
import { Loader2, Plus } from 'lucide-react';

export default function CustomButton({ children, isAdd, variant = 'primary', isPending = false, type = 'button', className = '', onTrigger = () => {}, ...props }) {
    const variantStyles = variant === 'danger' ? 'btn-danger btn text-white' : 'bg-primary btn text-white';

    return (
        <button type={type} disabled={isPending || props.disabled} className={`  ${variantStyles} ${className}`} onClick={onTrigger} {...props}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <span className='flex items-center gap-2'>
                {children}
                {isAdd && <Plus className='w-4 h-4' />}
            </span>
        </button>
    );
}
