import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export default function BackButton({
    variant = 'ghost',
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            className={cn('absolute top-1/2 left-4 z-50 m-0 size-7 -translate-y-1/2', className)}
            variant={variant}
            onClick={() => {
                history.back();
                return false;
            }}
        >
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
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
            </svg>
        </Button>
    );
}
