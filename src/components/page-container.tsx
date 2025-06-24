
import type React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`container mx-auto max-w-screen-xl glass-card ${className}`}>
      {children}
    </div>
  );
}
