'use client';
import React from 'react';

export default function CustomCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}
