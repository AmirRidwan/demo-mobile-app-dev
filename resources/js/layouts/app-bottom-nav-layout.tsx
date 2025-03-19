import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppBottomNavLayout({
    children,
    className,
    ...props
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn(`sticky bottom-0 max-w-full border-t-1 bg-neutral-900`, className)}>
            {children}
        </div>
    );
}
