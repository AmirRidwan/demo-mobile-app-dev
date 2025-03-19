import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

export default function PaymentSuccess() {
    return (
        <AppLayout className="h-svh">
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-40"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
                <h1 className="my-8 text-2xl font-bold">Congratulations!</h1>
                <p className="mb-6">
                    Your ticket purchase is successful, a confirmation has been sent to your email.
                </p>

                <Button asChild className="w-full">
                    <Link href={route('home')}>Back to main page</Link>
                </Button>
            </div>
        </AppLayout>
    );
}
