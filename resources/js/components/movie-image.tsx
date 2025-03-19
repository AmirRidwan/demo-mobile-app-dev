import { cn } from '@/lib/utils';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

export default function MovieImage({
    src,
    className,
    ...props
}: {
    src: string | null;
    className?: string;
}) {
    return (
        <AspectRatio ratio={2 / 3}>
            <img
                {...props}
                src={src ? `https://image.tmdb.org/t/p/w342${src}` : '/img/avatar.jpg'}
                className={cn('h-full w-full rounded-md object-cover', className)}
            />
        </AspectRatio>
    );
}
