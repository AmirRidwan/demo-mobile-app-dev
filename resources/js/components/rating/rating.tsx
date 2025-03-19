import Star from './star';

export default function Rating({ rating, ...props }: { rating: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((s, i) => (
                    <Star key={i} filled={i < rating} />
                ))}
            </div>{' '}
            <p className="text-xs text-neutral-400">{rating} / 5</p>
        </div>
    );
}
