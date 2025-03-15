import { AppBottomNav } from '@/components/app-bottom-nav';
import { AppHeader } from '@/components/app-header';
import MovieThumbnail from '@/components/movie-thumbnail';
import SectionTitle from '@/components/text/section-title';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export type MovieType = {
    id: number;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: number;
};

export default function Welcome({
    new_movies,
    recommended_movies,
    popular_movies,
}: {
    new_movies: MovieType[];
    recommended_movies: MovieType[];
    popular_movies: MovieType[];
}) {
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <AppLayout>
                <AppHeader />

                <section>
                    <SectionTitle viewMore={true}>New Releases</SectionTitle>
                    <div className="flex flex-row gap-3 overflow-auto">
                        {new_movies.map((m: MovieType) => (
                            <MovieThumbnail key={m.id} movie={m} />
                        ))}
                    </div>
                </section>

                <section>
                    <SectionTitle viewMore={true}>Popular in cinemas</SectionTitle>
                    <div className="flex flex-row gap-3 overflow-auto">
                        {popular_movies.map((m: MovieType) => (
                            <MovieThumbnail key={m.id} movie={m} />
                        ))}
                    </div>
                </section>

                <section>
                    <SectionTitle viewMore={true}>Recommended for you</SectionTitle>
                    <div className="flex flex-row gap-3 overflow-auto">
                        {recommended_movies.map((m: MovieType) => (
                            <MovieThumbnail key={m.id} movie={m} />
                        ))}
                    </div>
                </section>
            </AppLayout>
            <AppBottomNav />
        </>
    );
}
