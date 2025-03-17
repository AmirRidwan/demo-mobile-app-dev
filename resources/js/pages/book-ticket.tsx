import { AppHeader } from '@/components/app-header';
import { default as Seat } from '@/components/seat/seat';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export type LocationType = {
    id: string;
    state: string;
    locations: {
        id: string;
        cinema: string;
    }[];
};

export type SeatType = {
    id: string;
    row: string;
    number: string;
    status: 'booked' | 'selected' | 'available' | 'locked';
    price: number;
};

export default function Movie({
    id,
    locations,
    seats,
    ...props
}: {
    id: number;
    locations: LocationType[];
    seats: SeatType[];
}) {
    const [selectedState, setSelectedState] = useState<LocationType>(locations[0]);
    const [date, setDate] = useState<Date>();
    const [seat, setSeat] = useState<SeatType[]>(seats);

    const selectedSeatsId = seat.reduce<string[]>((acc, s) => {
        if (s.status === 'selected') {
            acc.push(s.id);
        }
        return acc;
    }, []);

    return (
        <>
            <AppHeader backBtn={true} title="Ticket Booking" />
            <AppLayout>
                <p className="text-sm">Where would you like to see the movie?</p>
                <div>
                    <Label htmlFor="state">State</Label>
                    <Select
                        value={selectedState.state}
                        onValueChange={(e) =>
                            setSelectedState(locations.find((c) => c.state == e)!)
                        }
                    >
                        <SelectTrigger className="mt-1 w-full">
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
                </div>

                <div>
                    <Label htmlFor="location">Location</Label>

                    <Select value={selectedState.locations[0].cinema}>
                        <SelectTrigger className="mt-1 w-full">
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
                </div>

                <div>
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'mt-1 w-full justify-start text-left font-normal',
                                    !date && 'text-muted-foreground',
                                )}
                            >
                                <CalendarIcon />
                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                fromDate={new Date()}
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label htmlFor="time">Available time</Label>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                        <Button size="sm" className="text-xs" variant="outline">
                            9:20AM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            11:40AM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            1:20PM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            3:30PM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            5:40PM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            7:30PM
                        </Button>
                        <Button size="sm" className="text-xs" variant="outline">
                            9:20PM
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="seat" className="">
                        Select Seat
                    </Label>
                    <div className="my-3 flex w-full items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Seat status="available" />
                            <p className="text-xs">Available</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Seat status="booked" />
                            <p className="text-xs">Unavailable</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Seat status="selected" />
                            <p className="text-xs">Selected</p>
                        </div>
                    </div>
                    <div className="w-3/4">
                        <div className="flex h-6 items-center justify-center bg-zinc-700">
                            <p className="text-xs">Screen</p>
                        </div>
                        <div className="h-16 bg-linear-to-b from-zinc-800 to-transparent"></div>
                    </div>
                    <div className="mt-1 flex w-full items-center justify-between gap-3 pb-3">
                        <div className="flex flex-col gap-4">
                            <div className="text-xs">A</div>
                            <div className="text-xs">B</div>
                            <div className="text-xs">C</div>
                            <div className="text-xs">D</div>
                            <div className="text-xs">E</div>
                            <div className="text-xs">F</div>
                            <div className="text-xs">G</div>
                            <div className="text-xs">H</div>
                        </div>
                        <div className="grid grid-cols-8 gap-4">
                            {seat.map((s) => (
                                <Seat
                                    onClick={(e) =>
                                        setSeat(
                                            seat.map((seat) =>
                                                s.id === seat.id && seat.status !== 'booked'
                                                    ? {
                                                          ...seat,
                                                          status:
                                                              seat.status === 'available'
                                                                  ? 'selected'
                                                                  : 'available',
                                                      }
                                                    : seat,
                                            ),
                                        )
                                    }
                                    key={s.id}
                                    id={s.id}
                                    status={s.status}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="text-xs">A</div>
                            <div className="text-xs">B</div>
                            <div className="text-xs">C</div>
                            <div className="text-xs">D</div>
                            <div className="text-xs">E</div>
                            <div className="text-xs">F</div>
                            <div className="text-xs">G</div>
                            <div className="text-xs">H</div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center border p-3 text-center">
                        <Label htmlFor="selected_seat" className="">
                            Selected Seat
                        </Label>
                        <div className="mt-2 flex max-w-full flex-wrap items-center justify-center gap-1">
                            {selectedSeatsId.length === 0 ? (
                                <p className="text-muted-foreground text-xs">No seat selected</p>
                            ) : (
                                selectedSeatsId.map((s) => (
                                    <div
                                        key={s}
                                        className="flex items-center justify-center border-1 p-1.5 text-xs"
                                    >
                                        {s}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="w-full flex-col items-center border p-3 text-center">
                        <Label htmlFor="subtotal" className="">
                            Subtotal
                        </Label>

                        <p className="text-sm">
                            RM
                            {seat
                                .filter((s) => s.status === 'selected')
                                .reduce((acc, s) => (acc += s.price), 0)}
                        </p>
                    </div>
                </div>
            </AppLayout>
            <AppBottomNavLayout className="flex gap-3 p-3">
                <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href={route('home')}>Cancel</Link>
                </Button>

                <Button asChild className="w-full">
                    <Link href={route('book.summary', [id, selectedSeatsId])}>Book Ticket</Link>
                </Button>
            </AppBottomNavLayout>
        </>
    );
}
