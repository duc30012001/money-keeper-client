import { AppSearchProps } from '@/components/ui/input/search';
import {
    useQueryStates,
    UseQueryStatesKeysMap,
    UseQueryStatesOptions,
    Values,
} from 'nuqs';

export interface UseFilterProps<FilterValues> {
    filterValues: FilterValues;
    onChangePage: (page: number, pageSize: number) => void;
    onSearch: AppSearchProps['onChange'];
    onChangeFilter: (newValues: FilterValues, backToFirst?: boolean) => void;
    resetFilterValues: () => void;
}

export function useFilter<
    FilterValues,
    KeyMap extends UseQueryStatesKeysMap = UseQueryStatesKeysMap,
>(
    keyMap: KeyMap,
    options?: Partial<UseQueryStatesOptions<KeyMap>>
): UseFilterProps<FilterValues> {
    const [filterValues, setFilterValues] = useQueryStates(keyMap, {
        history: 'replace',
        ...options,
    });

    const onChangePage = (page: number, pageSize: number) => {
        setFilterValues({ page, pageSize } as Values<KeyMap>);
    };

    const onSearch: AppSearchProps['onChange'] = (e) => {
        const keyword = e.target.value.trim();
        setFilterValues({ keyword, page: 1 } as Values<KeyMap>);
    };

    const onChangeFilter = (newValues: FilterValues, backToFirst = true) => {
        const sanitized = Object.fromEntries(
            Object.entries(newValues as {}).map(([key, value]) => [
                key,
                value === undefined ? null : value,
            ])
        ) as Values<KeyMap>;

        setFilterValues({
            ...(backToFirst && { page: 1 }),
            ...sanitized,
        });
    };

    const resetFilterValues = () => {
        setFilterValues(null);
    };

    return {
        filterValues: filterValues as FilterValues,
        onChangePage,
        onSearch,
        onChangeFilter,
        resetFilterValues,
    };
}
