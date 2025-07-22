import dayjs from 'dayjs';

export const defaultTransactionDate = [
    dayjs().startOf('month').valueOf(),
    dayjs().endOf('month').valueOf(),
];
