import BackButton from './button/back-btn';

export function AppHeader({
    title,
    backBtn,
    className,
    ...props
}: {
    title: string;
    backBtn: boolean;
    className?: string;
}) {
    return (
        <>
            <div className="relative flex items-center space-y-3 border-b-1 bg-transparent p-4">
                <BackButton className="" />

                <h3 className="mx-auto font-bold">{title}</h3>
            </div>
        </>
    );
}
