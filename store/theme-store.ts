import { ThemeMode } from '@/enums/common';
import { create } from 'zustand';

interface ThemeStore {
    theme: ThemeMode;
    setTheme: (value: ThemeMode) => void;
}

export const createThemeStore = () =>
    create<ThemeStore>((set) => ({
        theme: ThemeMode.LIGHT,
        setTheme: (value) => set({ theme: value }),
    }));
