import { cn } from '@/lib/utils';
import { MovieType } from '@/pages/welcome';
import { Link } from '@inertiajs/react';
import MovieImage from './movie-image';

export default function MovieThumbnail({
    movie,
    className,
    ...props
}: {
    movie: MovieType;
    className?: string;
}) {
    return (
        <Link href={route('movie_details', movie.id)}>
            <div className={cn('flex w-48 flex-none flex-col pb-4', className)}>
                <MovieImage src={movie.poster_path} />

                <h5 className="mt-3 text-sm font-bold">{movie.title}</h5>
            </div>
        </Link>
    );
}
