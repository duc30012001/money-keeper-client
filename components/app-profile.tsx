import { Avatar, Dropdown, theme } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

type Props = {};

function AppProfile({}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { data } = useSession();
    const email = data?.user?.email;
    const avatarPlaceholder = email?.[0]?.toUpperCase() || 'u';

    const items: ItemType[] = [
        {
            label: (
                <div className="flex max-w-xs items-center text-base">
                    <Avatar
                        size={40}
                        className="flex-none cursor-pointer"
                        style={{ backgroundColor: token.colorPrimary }}
                    >
                        {avatarPlaceholder}
                    </Avatar>
                    <div className="ml-3 truncate">
                        <p className="truncate">{email}</p>
                    </div>
                </div>
            ),
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: messages('auth.signOut'),
            key: '3',
            onClick: () => signOut(),
            icon: <LogOut />,
        },
    ];
    return (
        <Dropdown trigger={['click']} menu={{ items }}>
            <Avatar
                size={40}
                className="cursor-pointer"
                style={{ backgroundColor: token.colorPrimary }}
            >
                {avatarPlaceholder}
            </Avatar>
        </Dropdown>
    );
}

export default AppProfile;
