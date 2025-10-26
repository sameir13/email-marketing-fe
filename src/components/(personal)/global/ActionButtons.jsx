'use client';
import React from 'react';
import { Edit, Trash, Eye } from 'lucide-react';

export default function ActionButtons({ onEdit, onDelete, onView, showEdit = true, showDelete = true, showView = false }) {
    return (
        <div className="flex items-center gap-2">
            {showEdit && (
                <button type="button" onClick={onEdit} className="p-1 rounded hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-700" />
                </button>
            )}
            {showDelete && (
                <button type="button" onClick={onDelete} className="p-1 rounded hover:bg-gray-100">
                    <Trash className="w-4 h-4 text-red-600" />
                </button>
            )}
            {showView && (
                <button type="button" onClick={onView} className="p-1 rounded hover:bg-gray-100">
                    <Eye className="w-4 h-4 text-primary" />
                </button>
            )}
        </div>
    );
}
