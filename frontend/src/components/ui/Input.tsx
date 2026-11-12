import React, { forwardRef, useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  variant?: 'dark' | 'light';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon,
      type = 'text',
      variant = 'dark',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const isLight = variant === 'light';

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`text-xs font-semibold uppercase tracking-wider ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leadingIcon && (
            <span
              className={`absolute left-4 flex items-center pointer-events-none text-lg ${
                isLight ? 'text-gray-500' : 'text-[#FF7A59]'
              }`}
            >
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`w-full min-h-[48px] py-3 rounded-2xl text-sm font-inter transition-all duration-200 focus:outline-none focus:ring-2 ${
              leadingIcon ? 'pl-12' : 'pl-4'
            } ${isPassword ? 'pr-12' : 'pr-4'} ${
              isLight
                ? 'bg-white/90 border border-gray-200 text-[#0B1220] placeholder:text-gray-400 focus:ring-[#FF7A59] focus:border-transparent'
                : 'bg-[#151B2A] border border-white/10 text-[#FFF7ED] placeholder:text-gray-500 focus:ring-[#2DD4BF] focus:border-transparent'
            } ${
              error
                ? 'border-rose-500 focus:ring-rose-500/50'
                : ''
            } ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className={`absolute right-3.5 p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                isLight ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
