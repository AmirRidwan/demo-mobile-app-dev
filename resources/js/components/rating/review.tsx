import { ReviewType } from '@/pages/movie';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import Rating from './rating';

export default function Review({
    review,
    className,
    ...props
}: {
    review: ReviewType;
    className?: string;
}) {
    return (
        <Card className="min-w-4/5">
            <CardHeader>
                <Rating rating={Math.floor(review.author_details.rating / 2)} />
            </CardHeader>
            <CardContent className="space-y-3">
                <CardTitle>{review.author}</CardTitle>
                <CardDescription className="h-24 overflow-auto leading-[150%] text-ellipsis">
                    {review.content}
                </CardDescription>
            </CardContent>
        </Card>
    );
}
