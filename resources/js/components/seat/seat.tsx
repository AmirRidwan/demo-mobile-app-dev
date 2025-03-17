export default function Seat({
    status = 'available',
    id,
    onClick,
    ...props
}: {
    id?: string;
    status: 'booked' | 'selected' | 'available';
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
    return (
        <div
            id={id}
            className={`relative size-4 rounded ${status === 'selected' ? 'bg-zinc-200' : 'bg-zinc-800'}`}
            onClick={onClick}
            {...props}
        >
            {status == 'booked' && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute top-0 left-0 size-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            )}
        </div>
    );
}
