'use client';

import { useThemeMode } from '@/hooks/use-theme-mode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppToast() {
    const { isDark } = useThemeMode();

    return (
        <ToastContainer
            position="bottom-right"
            newestOnTop
            closeOnClick
            theme={isDark ? 'dark' : 'light'}
        />
    );
}
