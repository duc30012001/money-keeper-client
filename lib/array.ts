import { cloneDeep } from 'lodash';

export const removeEmptyChildren = (data: any[]) => {
    let tempData = cloneDeep(data);
    tempData = tempData.map((item) => {
        const childLength = item?.children?.length || 0;
        if (childLength > 0) {
            return {
                ...item,
                childLength,
                children: removeEmptyChildren(item?.children),
            };
        }
        const newItem = { ...item };
        newItem.children = null;
        return newItem;
    });
    return tempData;
};
