import BackButton from '@/components/button/back-btn';
import Rating from '@/components/rating/rating';
import Review from '@/components/rating/review';
import Star from '@/components/rating/star';
import SectionTitle from '@/components/text/section-title';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppBottomNavLayout } from '@/layouts/app-bottom-nav-layout';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import ReactPlayer from 'react-player/youtube';

export type MovieDetailsType = {
    id: number;
    poster_path: string;
    original_title: string;
    runtime: number;
    vote_average: number;
    vote_count: number;
    overview: string;
    genres: {
        id: string;
        name: string;
    }[];
};

export type TrailerType = {
    key: string;
};

export type CastsType = {
    id: number;
    name: string;
};

export type DirectorType = {
    name: string;
};

export type WriterType = {
    name: string;
};

export type ReviewType = {
    id: string;
    author: string;
    content: string;
    author_details: { rating: number };
};
export default function Movie({
    details,
    trailer,
    release_date,
    casts,
    director,
    writer,
    reviews,
}: {
    details: MovieDetailsType;
    trailer: TrailerType;
    release_date: string;
    casts: CastsType[];
    director: DirectorType;
    writer: WriterType;
    reviews: ReviewType[];
}) {
    return (
        <>
            <BackButton variant="default" className="top-7 left-4" />

            <AspectRatio ratio={16 / 9}>
                <ReactPlayer
                    controls={true}
                    width="100%"
                    height="100%"
                    url={`https://www.youtube.com/watch?v=${trailer.key}`}
                />
            </AspectRatio>
            <Separator />
            <AppLayout>
                <div className="flex gap-4 py-1">
                    <div className="w-32">
                        <AspectRatio ratio={2 / 3}>
                            <img
                                src={`https://image.tmdb.org/t/p/w342${details.poster_path}`}
                                className="h-full w-full rounded-md object-cover"
                            />
                        </AspectRatio>
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
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-3.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                />
                            </svg>
                            <p className="text-xs">{release_date}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-3.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>

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
                        </div>
                        <Rating rating={Math.floor(details.vote_average / 2)} />
                    </div>
                </div>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList>
                        <TabsTrigger value="details">Movie Details</TabsTrigger>
                        <TabsTrigger value="rating">Ratings & Reviews</TabsTrigger>
                    </TabsList>
                    <Separator />
                    <TabsContent value="details" className="mt-3">
                        <div className="space-y-3">
                            <div>
                                <SectionTitle viewMore={false}>Full Sypnopsis</SectionTitle>
                                <p className="text-sm leading-[150%]">{details.overview}</p>
                            </div>
                            <Separator />

                            <div className="space-y-3">
                                <div>
                                    <SectionTitle viewMore={false}>Cast</SectionTitle>
                                    <div className="space-y-1 space-x-1">
                                        {casts.map((c) => (
                                            <Badge key={c.id} variant="outline">
                                                {c.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Separator />

                            <div className="space-y-3">
                                <div>
                                    <SectionTitle viewMore={false}>Director</SectionTitle>
                                    <p className="text-sm leading-[150%]">{director.name}</p>
                                </div>
                            </div>
                            <Separator />

                            <div className="space-y-3">
                                <div>
                                    <SectionTitle viewMore={false}>Writer</SectionTitle>
                                    <p className="text-sm leading-[150%]">{writer.name}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="rating">
                        <div className="space-y-3">
                            {/* rating overview */}
                            <div className="flex items-center gap-2">
                                <Star filled={true} />
                                <p>
                                    {Math.floor(details.vote_average / 2)}{' '}
                                    <span className="text-xs">({details.vote_count} reviews)</span>
                                </p>
                            </div>

                            <Separator />

                            {/* rating statistic */}
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className="flex w-24 gap-0.5">
                                        {Array.from({ length: 5 }).map((s, i) => (
                                            <Star key={i} filled={true} className="size-2" />
                                        ))}
                                    </div>
                                    <Progress className="" value={50} />
                                    <p className="ms-2 text-xs">117</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex w-24 gap-0.5">
                                        {Array.from({ length: 4 }).map((s, i) => (
                                            <Star key={i} filled={true} className="size-2" />
                                        ))}
                                    </div>
                                    <Progress className="" value={63} />
                                    <p className="ms-2 text-xs">297</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex w-24 gap-0.5">
                                        {Array.from({ length: 3 }).map((s, i) => (
                                            <Star key={i} filled={true} className="size-2" />
                                        ))}
                                    </div>
                                    <Progress className="" value={75} />
                                    <p className="ms-2 text-xs">486</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex w-24 gap-0.5">
                                        {Array.from({ length: 2 }).map((s, i) => (
                                            <Star key={i} filled={true} className="size-2" />
                                        ))}
                                    </div>
                                    <Progress className="" value={72} />
                                    <p className="ms-2 text-xs">324</p>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex w-24 gap-0.5">
                                        {Array.from({ length: 1 }).map((s, i) => (
                                            <Star key={i} filled={true} className="size-2" />
                                        ))}
                                    </div>
                                    <Progress className="" value={10} />
                                    <p className="ms-2 text-xs">10</p>
                                </div>
                            </div>

                            <Separator />

                            {/* review */}
                            <div className="flex flex-nowrap gap-3 overflow-auto pb-3">
                                {reviews.map((r) => (
                                    <Review key={r.id} review={r} />
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </AppLayout>

            <AppBottomNavLayout className="p-3">
                <Button asChild className="w-full">
                    <Link href={route('book_ticket', details.id)}>Book Ticket</Link>
                </Button>
            </AppBottomNavLayout>
        </>
    );
}
