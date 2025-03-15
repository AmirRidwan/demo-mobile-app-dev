import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export type LocationType = {
    id: string;
    state: string;
    locations: {
        id: string;
        cinema: string;
    }[];
};
export default function Movie({ locations, ...props }: { locations: LocationType[] }) {
    const [selectedState, setSelectedState] = useState<LocationType>(locations[0]);

    return (
        <>
            <AppHeader backBtn={true} title="Ticket Booking" />
            <AppLayout>
                <p className="text-sm">Where would you like to see the movie?</p>

                <Select
                    value={selectedState.state}
                    onValueChange={(e) => setSelectedState(locations.find((c) => c.state == e)!)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((s) => (
                            <SelectItem key={s.id} value={s.state}>
                                {s.state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedState.locations[0].cinema}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {locations
                            .find((c) => c.state == selectedState.state)
                            ?.locations.map((l) => (
                                <SelectItem key={l.id} value={l.cinema}>
                                    {l.cinema}
                                </SelectItem>
                            )) ?? (
                            <SelectItem value="" disabled>
                                No locations found
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
            </AppLayout>
            <AppBottomNavLayout className="p-3">
                <Button asChild className="w-full">
                    <Link href="/book-ticket">Book Ticket</Link>
                </Button>
            </AppBottomNavLayout>
        </>
    );
}
