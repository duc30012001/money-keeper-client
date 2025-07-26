'use client';

import ForbiddenPage from '@/app/forbidden/page';
import AppLocale from '@/components/app-locale';
import AppLogo from '@/components/app-logo';
import AppProfile from '@/components/app-profile';
import AppTheme from '@/components/app-theme';
import { SIDEBAR_ITEMS } from '@/enums/routes';
import { usePathname } from '@/i18n/navigation';
import { useAuthUser } from '@/modules/auth/hooks/use-auth-user';
import { UserRole } from '@/modules/user/enums/user';
import { Button, Drawer, Layout, Menu, Spin, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { Menu as MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { PropsWithChildren, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';

interface Props extends PropsWithChildren {}

const { Header, Content, Sider } = Layout;
const ID = 'antd-pro-layout';

export default function CMSLayout({ children }: Props) {
    const { token } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    const messages = useTranslations();
    const pathname = usePathname();
    const responsive = useResponsive();

    const { data, isLoading } = useAuthUser();
    const role = data?.data?.role;

    const canAccess = (userRole?: UserRole, itemRole?: UserRole) =>
        itemRole ? itemRole === userRole : true;

    const items = SIDEBAR_ITEMS.filter((item) =>
        canAccess(role, item.role)
    ).map((item) => ({
        key: item.href,
        icon: <item.icon />,
        label: <Link href={item.href}>{messages(item.name)}</Link>,
        path: item.href,
    }));

    const toggleSidebar = () => setCollapsed((value) => !value);

    const currentRoute = SIDEBAR_ITEMS.find((item) => item.href === pathname);
    const canAccessCurrentRoute = canAccess(role, currentRoute?.role);

    const renderChildren = () => {
        if (isLoading) {
            return (
                <div className="flex h-96 items-center justify-center">
                    <Spin />
                </div>
            );
        }

        if (canAccessCurrentRoute) {
            return children;
        }

        return <ForbiddenPage />;
    };

    return (
        <React.Fragment>
            <Layout id={ID}>
                <Header
                    style={{
                        background: token.colorBgContainer,
                        borderColor: token.colorBorder,
                    }}
                    className="sticky top-0 z-50 flex items-center justify-between border-b !px-2"
                >
                    <div className="flex items-center gap-3">
                        <Button
                            type="text"
                            onClick={toggleSidebar}
                            className="!px-2"
                        >
                            <MenuIcon />
                        </Button>
                        <AppLogo labelClassName="hidden lg:block" />
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                        <AppLocale />
                        <AppTheme />
                        <AppProfile />
                    </div>
                </Header>
                <Layout>
                    {/* DESKTOP */}
                    <Sider
                        className="hidden lg:block"
                        width={250}
                        style={{
                            background: token.colorBgContainer,
                            height: 'calc(100vh - 4rem)',
                            position: 'sticky',
                            top: 64,
                            borderRightWidth: 1,
                            borderColor: token.colorBorder,
                            padding: 4,
                            paddingBottom: 0,
                        }}
                        collapsed={collapsed}
                        collapsedWidth={57}
                    >
                        {/* @ts-ignore */}
                        <Scrollbars autoHide>
                            <Menu
                                mode="inline"
                                selectedKeys={[pathname]}
                                style={{ height: '100%', borderRight: 0 }}
                                items={items}
                            />
                        </Scrollbars>
                    </Sider>
                    {/* MOBILE */}
                    {!responsive.lg && (
                        <Drawer
                            open={collapsed}
                            placement="left"
                            onClose={toggleSidebar}
                            width={300}
                            title={<AppLogo />}
                            styles={{
                                body: {
                                    padding: 0,
                                },
                            }}
                            destroyOnHidden
                        >
                            <Menu
                                mode="inline"
                                selectedKeys={[pathname]}
                                style={{ height: '100%', borderRight: 0 }}
                                items={items}
                            />
                        </Drawer>
                    )}
                    <Layout>
                        <Content>
                            <div className="min-h-[calc(100vh-4rem)]">
                                {renderChildren()}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </React.Fragment>
    );
}
