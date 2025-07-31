import { FloatButton } from 'antd';
import { CircleQuestionMark } from 'lucide-react';

type Props = {};

function SupportButton({}: Props) {
    const supportUrl = process.env.NEXT_PUBLIC_SUPPORT_LINK;
    if (supportUrl) {
        return (
            <FloatButton
                icon={<CircleQuestionMark />}
                onClick={() => {
                    window.open(process.env.NEXT_PUBLIC_SUPPORT_LINK, '_blank');
                }}
            />
        );
    }
    return null;
}

export default SupportButton;
