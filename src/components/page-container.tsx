
import type React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`container mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
