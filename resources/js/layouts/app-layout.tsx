import { cn } from '@/lib/utils';

export default function AppLayout({
    children,
    className,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div {...props} className={cn('relative space-y-3 p-4', className)}>
            {children}
        </div>
    );
}
