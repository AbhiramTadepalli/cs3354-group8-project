export function requestToUrl(request) {
    // Convert request object to URL parameters
    return '?' + Object.keys(request)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(request[key]))
        .join('&');
}