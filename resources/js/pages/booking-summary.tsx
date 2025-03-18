import { AppHeader } from '@/components/app-header';
import MovieImage from '@/components/movie-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { MovieType } from './welcome';

export default function Movie({
    details,
    state,
    date,
    location,
    time,
    seats,
    price,
}: {
    details: MovieType;
    state: string;
    location: string;
    date: string;
    time: string;
    seats: string[];
    price: string | number;
}) {
    const tax = (+price * 0.1).toFixed(2);

    return (
        <div className="h-dvh">
            <AppHeader backBtn={true} title="Booking Summary" />
            <AppLayout className="min-h-[700px]">
                <div className="space-y-3 border p-3">
                    <div className="flex gap-4 py-1">
                        <div className="w-32">
                            <MovieImage src={details.poster_path} />
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold">{details.original_title}</h4>
                                <div className="space-x-2">
                                    {details.genres.map((g) => (
                                        <Badge key={g.id} variant="outline">
                                            {g.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="space-x-0.5 text-xs">
                                    <span>
                                        {Math.floor(details.runtime / 60)} hour
                                        {Math.floor(details.runtime / 60) > 1 && 's'}
                                    </span>
                                    <span>
                                        {details.runtime % 60} minute
                                        {Math.floor(details.runtime % 60) > 1 && 's'}
                                    </span>
                                </p>

                                <p className="text-xs">English, IMAXX 3D</p>
                                <p className="text-xs">Classic tickets</p>
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <Label className="text-xs text-zinc-500">Cinema</Label>
                            <p className="text-sm">
                                {location}, {state}
                            </p>
                        </div>
                        <div>
                            <Label className="text-xs text-zinc-500">Seats</Label>
                            <div className="flex items-baseline text-sm">
                                <p>{seats.join(', ')}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs text-zinc-500">Date & Time</Label>
                            <p className="text-sm">
                                {date}, {time}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 border p-3">
                    <div className="flex items-center justify-between">
                        <div className="w-3/5">
                            <Label className="">Tickets</Label>
                            <p className="text-xs text-zinc-500">Classic ticket x{seats.length}</p>
                        </div>
                        <p>RM{(+price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-3/5">
                            <Label className="">Tax / Charges</Label>
                            <p className="text-xs text-zinc-500">Service tax: 10%</p>
                        </div>
                        <p>RM{tax}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="w-3/5">
                            <Label className="">Promo code</Label>
                        </div>

                        <Input />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <h3 className="fond-bold text-lg">Total amount payable</h3>
                        RM{(+price + +tax).toFixed(2)}
                    </div>
                </div>
            </AppLayout>
            <AppBottomNavLayout className="p-3">
                <Button asChild className="w-full">
                    <Link href={route('payment.success', { seats })}>Proceed to Payment</Link>
                </Button>
            </AppBottomNavLayout>
        </div>
    );
}
