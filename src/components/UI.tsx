import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-dark-card shadow-md border border-black/5 dark:border-white/10',
    glass: 'bg-white/70 dark:bg-dark-card/70 backdrop-blur-md border border-white/20 dark:border-white/10',
    outline: 'bg-transparent border-2 border-primary/10 dark:border-white/10'
  };

  return (
    <div 
      className={cn('rounded-2xl p-4 transition-all duration-200', variants[variant], className)} 
      {...props} 
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300',
    danger: 'bg-warning text-white hover:bg-warning/90',
    accent: 'bg-accent text-white hover:bg-accent/90',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg font-medium',
    icon: 'p-2 rounded-full'
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props} 
    />
  );
}

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  variant?: 'display' | 'body' | 'caption';
}

export function Typography({ 
  as: Component = 'p', 
  variant = 'body', 
  className, 
  ...props 
}: TypographyProps) {
  const variants = {
    display: 'font-display font-bold tracking-tight',
    body: 'font-sans',
    caption: 'font-sans text-sm opacity-70'
  };

  return (
    <Component 
      className={cn(variants[variant], className)} 
      {...props} 
    />
  );
}
