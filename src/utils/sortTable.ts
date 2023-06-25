export function sortTableByAlphanumeric<T>(
    initData: Array<T>,
    keyName: string,
    sortOrder: 'decreasing' | 'increasing'
) {
    const sortedData = [...initData];

    switch (sortOrder) {
        case 'decreasing':
            sortedData.sort((prevUser, currUser) =>
                prevUser[keyName] < currUser[keyName] ? -1 : 1
            );
            return sortedData;
        case 'increasing':
            sortedData.sort((prevUser, currUser) =>
                prevUser[keyName] > currUser[keyName] ? -1 : 1
            );
            return sortedData;

        default:
            return sortedData;
    }
}
