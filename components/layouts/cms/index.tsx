import AppLocale from '@/components/app-locale';
import AppLogo from '@/components/app-logo';
import AppProfile from '@/components/app-profile';
import AppTheme from '@/components/app-theme';
import { Screen } from '@/enums/common';
import { SIDEBAR_ITEMS } from '@/enums/routes';
import { usePathname } from '@/i18n/navigation';
import { Button, Drawer, Layout, Menu, theme } from 'antd';
import { Menu as MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { PropsWithChildren, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useMediaQuery } from 'usehooks-ts';

interface Props extends PropsWithChildren {}

const { Header, Content, Sider } = Layout;
const ID = 'antd-pro-layout';

export default function CMSLayout({ children }: Props) {
    const { token } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    const messages = useTranslations();
    const pathname = usePathname();
    const isDesktop = useMediaQuery(`(min-width: ${Screen.LG}px)`);

    const items = SIDEBAR_ITEMS.map((item) => ({
        key: item.href,
        icon: <item.icon />,
        label: <Link href={item.href}>{messages(item.name)}</Link>,
        path: item.href,
    }));

    const toggleSidebar = () => setCollapsed((value) => !value);

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
                    <div className="flex items-center gap-2">
                        <Button type="text" onClick={toggleSidebar}>
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
                    {isDesktop ? (
                        <Sider
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
                            collapsedWidth={64}
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
                    ) : (
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
                        <Content>{children}</Content>
                    </Layout>
                </Layout>
            </Layout>
        </React.Fragment>
    );
}
