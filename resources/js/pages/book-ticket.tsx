import { AppHeader } from '@/components/app-header';
import { RadioButton, RadioButtonItem } from '@/components/button/radio-btn';
import { default as Seat } from '@/components/seat/seat';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
    const [selectedState, setSelectedState] = useState<string>(locations[0].state);
    const [seat, setSeat] = useState<SeatType[]>(seats);

    const selectedSeatsId = seat.reduce<string[]>((acc, s) => {
        if (s.status === 'selected') {
            acc.push(s.id);
        }
        return acc;
    }, []);

    const cinema = locations.find((c) => c.state == selectedState)?.locations ?? [];

    const subtotal = seat
        .filter((s) => s.status === 'selected')
        .reduce((acc, s) => (acc += s.price), 0);

    const formSchema = z.object({
        // these array should be able to be generated via mapping the props. but idk why not working
        // thats why hard code
        state: z.enum(['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Sabah', 'Sarawak'], {
            message: 'Please select a valid state.',
        }),
        date: z.date({
            required_error: 'Please select a valid date.',
        }),
        // should have a second validation : location is based on state selected
        location: z.enum(
            [
                'Sunway Pyramid',
                '1 Utama',
                'IOI City Mall',
                'Pavilion Bukit Jalil',
                'Pavilion KL',
                'Mid Valley Megamall',
                'KLCC',
                'The Gardens Mall',
                'Gurney Plaza',
                'Queensbay Mall',
                'Johor Bahru City Square',
                'Paradigm Mall',
                'Suria Sabah',
                'Imago Shopping Mall',
                'VivaCity Megamall',
                'Plaza Merdeka',
            ],
            {
                required_error: 'Please select a valid location.',
            },
        ),

        time: z.enum(['9:20PM', '7:40PM', '5:40PM', '3:30PM', '1:20PM', '11:40AM', '9:20AM'], {
            required_error: 'Please select a valid time.',
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            state: 'Selangor',
            location: 'Sunway Pyramid',
            date: new Date(),
        },
        values: {
            location: cinema[0].cinema,
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
        // console.log(data)
        router.get(route('book.summary', { id, selectedSeatsId, subtotal, ...data }));
    }

    return (
        <>
            <AppHeader backBtn={true} title="Ticket Booking" />
            <AppLayout>
                <p className="mb-6 text-sm">Where would you like to see the movie?</p>
                <Form {...form}>
                    <form
                        id="form-ticket"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Select
                                        onValueChange={(e) => {
                                            setSelectedState(e);
                                            field.onChange(e);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations.map((s) => (
                                                <SelectItem key={s.id} value={s.state}>
                                                    {s.state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {locations
                                                .find((c) => c.state == selectedState)
                                                ?.locations.map((l, i) => (
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

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, 'PPP')
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                fromDate={new Date()}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Available Time</FormLabel>
                                    <FormControl>
                                        <RadioButton
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-3 gap-2"
                                        >
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="9:20AM" value="9:20AM" />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem
                                                        text=" 11:40AM"
                                                        value="11:40AM"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="1:20PM" value="1:20PM" />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="3:30PM" value="3:30PM" />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="5:40PM" value="5:40PM" />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="7:40PM" value="7:40PM" />
                                                </FormControl>
                                            </FormItem>
                                            <FormItem className="'">
                                                <FormControl>
                                                    <RadioButtonItem text="9:20PM" value="9:20PM" />
                                                </FormControl>
                                            </FormItem>
                                        </RadioButton>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

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
                                                s.id === seat.id &&
                                                seat.status !== 'booked' &&
                                                seat.status !== 'locked'
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

                        <p className="text-sm">RM{subtotal}</p>
                    </div>
                </div>
            </AppLayout>
            <AppBottomNavLayout className="flex gap-3 p-3">
                <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href={route('home')}>Cancel</Link>
                </Button>
                <Button
                    className="w-full"
                    disabled={selectedSeatsId.length == 0}
                    form="form-ticket"
                >
                    Book Ticket
                </Button>
                {/* <Button
                    asChild={selectedSeatsId.length !== 0}
                    disabled={selectedSeatsId.length == 0}
                    className="w-full"
                >
                    <Link href={route('book.summary', { selectedSeatsId, id })}>Book Ticket</Link>
                </Button> */}
            </AppBottomNavLayout>
        </>
    );
}
