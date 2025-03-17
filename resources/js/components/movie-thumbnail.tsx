import { MovieType } from '@/pages/welcome';
import { Link } from '@inertiajs/react';
import { AspectRatio } from './ui/aspect-ratio';

export default function MovieThumbnail({ movie, ...props }: { movie: MovieType }) {
    return (
        <Link href={route('movie_details', movie.id)}>
            <div className="flex w-48 flex-none flex-col pb-4">
                <AspectRatio ratio={2 / 3}>
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                                : '/img/avatar.jpg'
                        }
                        className="h-full w-full rounded-md object-cover"
                    />
                </AspectRatio>
                <h5 className="mt-3 text-sm font-bold">{movie.title}</h5>
            </div>
        </Link>
    );
}
