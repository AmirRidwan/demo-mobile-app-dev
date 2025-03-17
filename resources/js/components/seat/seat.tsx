export default function Seat({
    status = 'available',
    id,
    onClick,
    ...props
}: {
    id?: string;
    status: 'booked' | 'selected' | 'available' | 'locked';
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

            {status == 'locked' && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="absolute top-0 left-0 size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                </svg>
            )}
        </div>
    );
}
