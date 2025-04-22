import {
    CreditCard,
    Layers,
    ListCheck,
    Tag,
    User,
    Users,
    Zap,
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
    { title: 'Account Types', href: AppRoute.AccountTypes, icon: Layers },
    { title: 'Accounts', href: AppRoute.Accounts, icon: User },
    { title: 'Categories', href: AppRoute.Categories, icon: Tag },
    { title: 'Action Types', href: AppRoute.ActionTypes, icon: Zap },
    { title: 'Users', href: AppRoute.Users, icon: Users },
];
