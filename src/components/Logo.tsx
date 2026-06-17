import { useState } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {!hasError ? (
        <img 
          src="/teti-logo.png" 
          alt="TETI Logo" 
          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          onError={() => setHasError(true)}
        />
      ) : (
        <Flame className="w-full h-full text-red-600" strokeWidth={1.5} />
      )}
    </div>
  );
};
