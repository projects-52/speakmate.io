import { ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  type = 'primary',
  loading,
  ...props
}: ButtonProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'done'>(
    'idle'
  );
  const prevLoadingRef = useRef<boolean>();

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      setLoadingState('done');
      setTimeout(() => {
        setLoadingState('idle');
      }, 500);
    } else if (loading) {
      setLoadingState('loading');
    }

    prevLoadingRef.current = loading;
  }, [loading]);

  return (
    <button
      {...props}
      className="mt-4 bg-dark-accent-500 text-white px-4 py-2 rounded-lg disabled:bg-slate-300 relative overflow-hidden"
    >
      {loadingState !== 'idle' && (
        <span className="absolute w-full h-full bg-accent-500 flex items-center justify-center top-0 left-0">
          {loadingState === 'loading' && (
            <ArrowPathIcon className="w-10 h-10 p-2 rotate" />
          )}
          {loadingState === 'done' && <CheckIcon className="w-10 h-10 p-2" />}
        </span>
      )}

      {children}
    </button>
  );
}
