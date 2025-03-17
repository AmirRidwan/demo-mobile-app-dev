import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';

export default function Movie({}: {}) {
    return (
        <>
            <AppHeader backBtn={true} title="Ticket Booking" />
            <AppLayout>'aaa'</AppLayout>
            <AppBottomNavLayout className="p-3">
                <Button asChild className="w-full">
                    {/* <Link href={route('book.summary')}>Book Ticket</Link> */}
                </Button>
            </AppBottomNavLayout>
        </>
    );
}
