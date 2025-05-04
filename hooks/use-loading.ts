import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export enum UseLoadingType {
    Fetching = 'fetching',
    Mutating = 'mutating',
}

export function useLoading(type?: UseLoadingType) {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    if (type === UseLoadingType.Fetching) {
        return isFetching !== 0;
    }

    if (type === UseLoadingType.Mutating) {
        return isMutating !== 0;
    }

    return isFetching + isMutating !== 0;
}
