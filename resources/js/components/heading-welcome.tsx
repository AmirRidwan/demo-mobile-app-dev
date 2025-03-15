import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Searchbar from './searchbar';
import { Button } from './ui/button';

export default function HeadingWelcome({ name, description }: { name: string; description?: string }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 overflow-hidden rounded-full">
                    <AvatarImage src="/img/avatar.jpg" alt="Ethan" className="object-cover" />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">E</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="">
                        Hello, <span className="font-bold">{name}!</span>
                    </h3>

                    {description && <p className="text-muted-foreground text-xs">{description}</p>}
                </div>

                <Button size="icon" variant="ghost" className="mb-auto size-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                    </svg>
                </Button>
            </div>

            <Searchbar />
        </div>
    );
}
