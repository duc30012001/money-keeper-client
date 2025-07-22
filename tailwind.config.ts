import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './modules/**/*.{js,ts,jsx,tsx,mdx}',
        './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            screens: {
                // extra‐small: everything below 576px (you can omit xs: if you don't need a prefix)
                xs: '0px',

                // AntD sm/md/lg/xl/xxl
                sm: '576px',
                md: '768px',
                lg: '992px',
                xl: '1200px',
                xxl: '1600px',
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
export default config;
