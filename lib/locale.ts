export function getBrowserLocale(defaultLocale = 'en-US'): string {
    if (typeof navigator === 'undefined') {
        // e.g. during SSR
        return defaultLocale;
    }

    const { languages, language } = navigator;
    if (Array.isArray(languages) && languages.length > 0) {
        return languages[0];
    }
    if (typeof language === 'string' && language.length > 0) {
        return language;
    }

    return defaultLocale;
}
