import { useState, forwardRef } from 'react';
import { AuthField, type AuthFieldProps } from './AuthField';

export interface PasswordFieldProps extends Omit<AuthFieldProps, 'type' | 'trailingElement'> {
  strength?: {
    score: number;
    label: string;
  };
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ strength, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleButton = (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-controls={id}
        className="p-2 text-ink-muted hover:text-ink-strong transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
      >
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
          {showPassword ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    );

    return (
      <div className="flex flex-col gap-2 w-full">
        <AuthField
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          trailingElement={toggleButton}
          {...props}
        />

        {strength && strength.score > 0 && (
          <div className="flex flex-col gap-1.5 mt-0.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted font-medium">Password Strength</span>
              <span className="text-ink-strong font-semibold">{strength.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full" aria-hidden="true">
              <div
                className={`rounded-full h-full transition-colors ${
                  strength.score >= 1 ? 'bg-danger' : 'bg-surface-3'
                }`}
              />
              <div
                className={`rounded-full h-full transition-colors ${
                  strength.score >= 2 ? 'bg-accent-bright' : 'bg-surface-3'
                }`}
              />
              <div
                className={`rounded-full h-full transition-colors ${
                  strength.score >= 3 ? 'bg-accent' : 'bg-surface-3'
                }`}
              />
              <div
                className={`rounded-full h-full transition-colors ${
                  strength.score >= 4 ? 'bg-success' : 'bg-surface-3'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
