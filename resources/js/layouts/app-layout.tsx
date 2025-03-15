export default function AppLayout({ children, ...props }: { children: React.ReactNode }) {
    return (
        <div {...props} className="relative space-y-3 p-4">
            {children}
        </div>
    );
}
