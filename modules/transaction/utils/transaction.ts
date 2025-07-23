import { TransactionType } from '../enums/transaction';

export const getAmountColor = (type: TransactionType) => {
    let color: string = 'default';

    switch (type) {
        case TransactionType.EXPENSE:
            color = 'error';
            break;
        case TransactionType.INCOME:
            color = 'success';
            break;
        case TransactionType.TRANSFER:
            color = 'processing';
            break;
        default:
            break;
    }

    return color;
};
