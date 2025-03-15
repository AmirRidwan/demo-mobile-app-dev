import { Icon } from '@/components/icon';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Heart, House, Ticket, User } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: House,
    },

    {
        title: 'Ticket',
        href: '/',
        icon: Ticket,
    },

    {
        title: 'Favourite',
        href: '/',
        icon: Heart,
    },

    {
        title: 'Profile',
        href: '/',
        icon: User,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppBottomNav() {
    const page = usePage<SharedData>();
    return (
        <>
            <div className="bg-sidebar sticky bottom-0 max-w-full border-t-1">
                {/* Mobile Menu */}
                <NavigationMenu className="">
                    <NavigationMenuList className="">
                        <div className="flex w-screen justify-between px-4">
                            {mainNavItems.map((item, index) => (
                                <NavigationMenuItem key={index} className="">
                                    <Link
                                        href={item.href}
                                        className="flex size-16 cursor-pointer flex-col items-center gap-0.5 bg-transparent p-3"
                                    >
                                        {item.icon && (
                                            <Icon iconNode={item.icon} className="size-5" />
                                        )}
                                        <p className="text-xs">{item.title}</p>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </div>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Desktop Navigation */}
                <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                    <NavigationMenu className="flex h-full items-stretch">
                        <NavigationMenuList className="flex h-full items-stretch space-x-2">
                            {mainNavItems.map((item, index) => (
                                <NavigationMenuItem
                                    key={index}
                                    className="relative flex h-full items-center"
                                >
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            page.url === item.href && activeItemStyles,
                                            'h-9 cursor-pointer px-3',
                                        )}
                                    >
                                        {item.icon && (
                                            <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                    {page.url === item.href && (
                                        <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </>
    );
}
