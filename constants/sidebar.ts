import {
    CreditCard,
    Layers,
    ListCheck,
    Tag,
    User,
    Users,
    type LucideIcon,
} from 'lucide-react';

export enum AppRoute {
    Dashboard = '/dashboard',
    Transactions = '/transactions',
    AccountTypes = '/account-types',
    Accounts = '/accounts',
    Categories = '/categories',
    ActionTypes = '/action-types',
    Users = '/users',
    Signin = '/',
}

export interface SidebarItem {
    title: string;
    href: AppRoute;
    icon: LucideIcon;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    { title: 'Dashboard', href: AppRoute.Dashboard, icon: ListCheck },
    {
        title: 'Transactions',
        href: AppRoute.Transactions,
        icon: CreditCard,
    },
    { title: 'Accounts', href: AppRoute.Accounts, icon: User },
    { title: 'Account Types', href: AppRoute.AccountTypes, icon: Layers },
    { title: 'Categories', href: AppRoute.Categories, icon: Tag },
    { title: 'Users', href: AppRoute.Users, icon: Users },
];
