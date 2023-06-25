export function replacePlaceholders(
    stringHtml: string,
    objectVariables?: Record<string, any>
) {
    if (!objectVariables) {
        return stringHtml;
    }
    for (let key in objectVariables) {
        if (typeof objectVariables[key] === 'object') {
            stringHtml = replacePlaceholders(stringHtml, objectVariables[key]);
        } else {
            const placeholder = '%' + key + '%';
            stringHtml = stringHtml.replace(
                new RegExp(placeholder, 'g'),
                objectVariables[key]
            );
        }
    }
    return stringHtml;
}
