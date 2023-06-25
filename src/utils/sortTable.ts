export function sortTableByAlphabetically<T>(
    initData: Array<T>,
    keyName: string,
    sortOrder: 'decreasing' | 'increasing'
) {
    const sortedData = [...initData];

    switch (sortOrder) {
        case 'decreasing':
            sortedData.sort((prevItem, currItem) =>
                prevItem[keyName].localeCompare(currItem[keyName])
            );
            return sortedData;
        case 'increasing':
            sortedData.sort((prevItem, currItem) =>
                currItem[keyName].localeCompare(prevItem[keyName])
            );
            return sortedData;

        default:
            return initData;
    }
}
