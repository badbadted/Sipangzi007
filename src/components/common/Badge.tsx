import { type ReactNode } from 'react';

interface BadgeProps {
  variant?: 'domestic' | 'international' | 'success' | 'warning' | 'danger';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'domestic', children, className = '' }: BadgeProps) {
  const variants = {
    domestic: 'bg-blue-100 text-blue-800',
    international: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
