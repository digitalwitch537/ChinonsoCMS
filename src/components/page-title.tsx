
import type React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
