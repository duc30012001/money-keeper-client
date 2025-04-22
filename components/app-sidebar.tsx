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
import { getDataFromToken } from '@/modules/auth/utils';
import { useSession } from 'next-auth/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession();
    const tokenPayload = getDataFromToken(session?.accessToken);

    const data = {
        user: {
            email: tokenPayload?.email ?? '',
        },
        navMain: SIDEBAR_ITEMS,
    };

    return (
        <Sidebar
            className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
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
