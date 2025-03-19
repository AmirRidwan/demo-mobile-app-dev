import { AppBottomNav } from '@/components/app-bottom-nav';
import { FilterContext } from '@/components/context/filter-context';
import MovieThumbnail from '@/components/movie-thumbnail';
import SectionTitle from '@/components/text/section-title';
import { WelcomeHeader } from '@/components/welcome-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export type MovieType = {
    id: number;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    vote_average: number;
    vote_count: number;
    original_title: string;
    runtime: number;
    genres: {
        id: string;
        name: string;
    }[];
};

export default function Welcome({
    all_movies,
    new_movies,
    recommended_movies,
    popular_movies,
}: {
    all_movies: MovieType[];
    new_movies: MovieType[];
    recommended_movies: MovieType[];
    popular_movies: MovieType[];
}) {
    const [filter, setFilter] = useState('');

    const filterResult = all_movies.filter((m) =>
        m.title.toLowerCase().includes(filter.toLowerCase()),
    );

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <AppLayout className="min-h-[calc(100vh-65px)]">
                <FilterContext.Provider value={{ filter, setFilter }}>
                    <WelcomeHeader />
                </FilterContext.Provider>

                {filter !== '' ? (
                    <section>
                        <SectionTitle viewMore={false}>Search Results</SectionTitle>
                        <div className="grid grid-cols-2 gap-3">
                            {filterResult.map((m: MovieType) => (
                                <MovieThumbnail className="w-auto" key={m.id} movie={m} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <>
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
                    </>
                )}
            </AppLayout>
            <AppBottomNav />
        </>
    );
}
