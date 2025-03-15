import { ReactNode } from 'react';
import { Button } from '../ui/button';

export default function SectionTitle({
    children,
    viewMore,
    className,
    ...props
}: {
    children: ReactNode;
    className?: string;
    viewMore: boolean;
}) {
    return (
        <div className="mb-3 flex items-center justify-between">
            <h4 className={`font-bold ${className}`} {...props}>
                {children}
            </h4>
            {viewMore && (
                <Button variant="ghost" size="sm">
                    View all
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                    </svg>
                </Button>
            )}
        </div>
    );
}
