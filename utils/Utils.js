export function getApiUrl(endPoint) {
    return `https://api.anphuc.me/api${endPoint}`;
}
export function convertToBlob(obj) {
    const json = JSON.stringify(obj);
    return new Blob([json], {
        type: 'application/json'
    });
}
