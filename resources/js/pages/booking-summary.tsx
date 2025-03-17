import { AppHeader } from '@/components/app-header';
import MovieImage from '@/components/movie-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';
import { MovieType } from './welcome';

export default function Movie({ details }: { details: MovieType }) {
    return (
        <>
            <AppHeader backBtn={true} title="Booking Summary" />
            <AppLayout>
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
                    <div>
                        <Label className="text-xs text-zinc-500">Cinema</Label>
                        <p className="text-sm">Sunway Gurney</p>
                    </div>
                    <div>
                        <Label className="text-xs text-zinc-500">Cinema</Label>
                        <p className="text-sm">Sunway Gurney</p>
                    </div>

                    <div>
                        <Label className="text-xs text-zinc-500">Cinema</Label>
                        <p className="text-sm">Sunway Gurney</p>
                    </div>
                </div>
            </AppLayout>
            <AppBottomNavLayout className="p-3">
                <Button asChild className="w-full">
                    {/* <Link href={route('book.summary')}>Book Ticket</Link> */}
                </Button>
            </AppBottomNavLayout>
        </>
    );
}
