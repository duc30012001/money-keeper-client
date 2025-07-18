'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { SIDEBAR_ITEMS } from '@/constants/sidebar';
import { useSession } from 'next-auth/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();

    // const navMain = SIDEBAR_ITEMS.filter((item) => {
    //     if (!item.role) {
    //         return true;
    //     }
    //     return item.role === session?.user?.role;
    // });

    const data = {
        user: {
            email: session?.user?.email ?? '',
        },
        navMain: SIDEBAR_ITEMS,
    };

    return (
        <Sidebar
            className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
            collapsible="icon"
            {...props}
        >
            <SidebarContent>
                <NavMain sidebarItems={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
