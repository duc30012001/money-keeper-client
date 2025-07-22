import { ThemeMode } from '@/enums/common';
import { theme } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { create } from 'zustand';

interface Store {
    themeMode: ThemeMode;
    prefersDark: boolean;
    setThemeMode: (value: ThemeMode) => void;
    setPrefersDark: (value: boolean) => void;
}

const useStore = create<Store>((set) => ({
    algorithm: theme.defaultAlgorithm,
    themeMode: ThemeMode.LIGHT,
    prefersDark: false,
    setThemeMode: (value: ThemeMode) => set({ themeMode: value }),
    setPrefersDark: (value) => set({ prefersDark: value }),
}));

export const useThemeMode = () => {
    const { themeMode, setThemeMode, prefersDark, setPrefersDark } = useStore();

    const onChangeTheme = (type: ThemeMode) => {
        setThemeMode(type);
        localStorage.setItem('themeMode', type);
    };

    // listen for OS theme changes (only matters when mode==='system')
    useEffect(() => {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
        mql.addEventListener('change', listener);

        const value =
            (localStorage.getItem('themeMode') as ThemeMode) ||
            ThemeMode.SYSTEM;

        onChangeTheme(value);
        setPrefersDark(mql.matches);

        return () => mql.removeEventListener('change', listener);
    }, []);

    const isDark = useRef(false);

    // decide which algorithm to apply
    const algorithm = useMemo(() => {
        if (typeof window === 'undefined') return;

        if (themeMode === ThemeMode.LIGHT) {
            document.documentElement.classList.remove('dark');
            isDark.current = false;
            return theme.defaultAlgorithm;
        }

        if (themeMode === ThemeMode.DARK) {
            document.documentElement.classList.add('dark');
            isDark.current = true;
            return theme.darkAlgorithm;
        }

        if (prefersDark) {
            document.documentElement.classList.add('dark');
            isDark.current = true;
            return theme.darkAlgorithm;
        }

        document.documentElement.classList.remove('dark');
        isDark.current = false;
        return theme.defaultAlgorithm;
    }, [themeMode, prefersDark]);

    return {
        isDark: isDark.current,
        algorithm,
        themeMode,
        setThemeMode: onChangeTheme,
    };
};
