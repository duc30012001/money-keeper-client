import { ScrollArea } from '@/components/ui/scroll-area';
import { Button, Image, Popover, Upload, UploadFile } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useIconsList } from '../hooks/use-icons';
import { Icon } from '../types/icon';
import { IconList } from './icon-list';
import { IconListSkeleton } from './icon-list-skeleton';

type Props = {
    value?: string;
    onChange?: (value: string | undefined) => void;
};

function IconSelect({ ...props }: Props) {
    const messages = useTranslations();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [keyword, setKeyword] = useState<string>();
    const [value, setValue] = useState(props.value);

    const { data: icons, isLoading } = useIconsList();
    const filteredData = (icons?.data ?? []).filter((icon: Icon) =>
        icon.name.toLowerCase().includes(keyword?.toLowerCase() ?? '')
    );
    const groupByTypeData = Object.groupBy(filteredData, ({ type }) => type);

    const selectedIcon = (icons?.data ?? []).find((item) => item.id === value);

    const onOpenChange = (value: boolean) => {
        setKeyword(undefined);
        setPopoverOpen(value);
    };

    const handleChange = (data?: Icon) => {
        if (data) {
            setValue(data.id);
            props.onChange?.(data.id);
        } else {
            setValue(undefined);
            props.onChange?.(undefined);
        }
        onOpenChange(false);
    };

    const handlePreview = async (file: UploadFile) => {
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const renderContent = () => {
        if (isLoading) {
            return <IconListSkeleton />;
        }
        return (
            <IconList
                rootClassName="top-0"
                titleClassName="top-9"
                data={groupByTypeData}
                searchProps={{
                    value: keyword,
                    onChange: (e) => setKeyword(e.target.value),
                }}
                onSelect={handleChange}
            />
        );
    };

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <div>
            <Popover
                content={
                    <ScrollArea className="h-96 max-w-screen-md">
                        {renderContent()}
                    </ScrollArea>
                }
                trigger="click"
                open={popoverOpen}
                onOpenChange={onOpenChange}
            >
                {value ? (
                    <Upload
                        listType="picture-card"
                        fileList={[
                            {
                                uid: value,
                                name: selectedIcon?.name || '',
                                url: selectedIcon?.url || '',
                            },
                        ]}
                        onPreview={handlePreview}
                        onRemove={() => handleChange()}
                    />
                ) : (
                    <Button type="dashed">
                        <Plus />
                        {messages('icon.select')}
                    </Button>
                )}
            </Popover>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    alt=""
                />
            )}
        </div>
    );
}

export default IconSelect;
