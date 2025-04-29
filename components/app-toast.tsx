import { ToastContainer } from 'react-toastify';

type Props = {};

function AppToast({}: Props) {
    return (
        <ToastContainer
            pauseOnFocusLoss={false}
            position="bottom-right"
            pauseOnHover
        />
    );
}

export default AppToast;
