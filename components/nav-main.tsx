'use client';

import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarItem } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain({ sidebarItems }: { sidebarItems: SidebarItem[] }) {
    const pathname = usePathname();
    return (
        <SidebarGroup>
            <SidebarMenu>
                {sidebarItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            className={cn({
                                'bg-accent text-accent-foreground':
                                    pathname === item.href,
                            })}
                        >
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
