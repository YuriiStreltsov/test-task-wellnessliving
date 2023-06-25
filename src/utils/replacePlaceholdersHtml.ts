export function replacePlaceholders(
    object: Record<string, any>,
    stringHtml: string
) {
    for (let key in object) {
        if (typeof object[key] === 'object') {
            stringHtml = replacePlaceholders(object[key], stringHtml);
        } else {
            const placeholder = '%' + key + '%';
            stringHtml = stringHtml.replace(
                new RegExp(placeholder, 'g'),
                object[key]
            );
        }
    }
    return stringHtml;
}
