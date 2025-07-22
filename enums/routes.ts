import { UserRole } from '@/modules/user/enums/user';
import {
    ChartColumnBig,
    Layers,
    LayoutGrid,
    ScrollText,
    Tag,
    Users,
    Wallet,
    type LucideIcon,
} from 'lucide-react';

export enum AppRoute {
    DASHBOARD = '/dashboard',
    TRANSACTIONS = '/transactions',
    ACCOUNT_TYPES = '/account-types',
    ACCOUNTS = '/accounts',
    BUDGETS = '/budgets',
    CATEGORIES = '/categories',
    ACTION_TYPES = '/action-types',
    ICONS = '/icons',
    USERS = '/users',
    SIGN_IN = '/sign-in',
    REGISTER = '/register',
    FORGOT_PASSWORD = '/forgot-password',
    RESET_PASSWORD = '/reset-password',
    FORBIDDEN = '/forbidden',
    NOT_FOUND = '/not-found',
}

export interface SidebarItem {
    title: string;
    name: string;
    href: AppRoute;
    icon: LucideIcon;
    role?: UserRole;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    {
        title: 'Dashboard',
        name: 'dashboard.title',
        href: AppRoute.DASHBOARD,
        icon: ChartColumnBig,
    },
    {
        title: 'Transactions',
        name: 'transaction.title',
        href: AppRoute.TRANSACTIONS,
        icon: ScrollText,
    },
    {
        title: 'Accounts',
        name: 'account.title',
        href: AppRoute.ACCOUNTS,
        icon: Wallet,
    },
    {
        title: 'Account Types',
        name: 'accountType.title',
        href: AppRoute.ACCOUNT_TYPES,
        icon: Layers,
    },
    {
        title: 'Categories',
        name: 'category.title',
        href: AppRoute.CATEGORIES,
        icon: Tag,
    },
    {
        title: 'Icons',
        name: 'icon.title',
        href: AppRoute.ICONS,
        icon: LayoutGrid,
        role: UserRole.ADMIN,
    },
    {
        title: 'Users',
        name: 'user.title',
        href: AppRoute.USERS,
        icon: Users,
        role: UserRole.ADMIN,
    },
];

export const PUBLIC_ROUTES = [AppRoute.NOT_FOUND];
export const AUTH_ROUTES = [
    AppRoute.SIGN_IN,
    AppRoute.REGISTER,
    AppRoute.FORGOT_PASSWORD,
    AppRoute.RESET_PASSWORD,
];
