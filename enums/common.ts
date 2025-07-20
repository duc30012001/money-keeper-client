export enum ModalType {
    CREATE = 'create',
    EDIT = 'edit',
    DELETE = 'delete',
}

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum PageSize {
    SMALL = 10,
    MEDIUM = 20,
    LARGE = 50,
    XLARGE = 100,
}

export enum Screen {
    SM = 576,
    MD = 768,
    LG = 992,
    XL = 1200,
    XXL = 1400,
    XXXL = 1600,
}

export enum Locale {
    EN = 'en',
    VI = 'vi',
}

export const defaultLocale = Locale.EN;

export enum ThemeMode {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system',
}
