import { Icon } from '@/components/icon';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
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

export function AppBottomNav() {
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
            </div>
        </>
    );
}
