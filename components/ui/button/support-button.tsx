import { FloatButton } from 'antd';
import { CircleQuestionMark } from 'lucide-react';

type Props = {};

function SupportButton({}: Props) {
    return (
        <FloatButton
            icon={<CircleQuestionMark />}
            onClick={() => {
                window.open(process.env.NEXT_PUBLIC_SUPPORT_LINK, '_blank');
            }}
        />
    );
}

export default SupportButton;
