export function flagRender(countryCode: string) {
    return countryCode
        .split('')
        .map(letter => letter.charCodeAt(0) % 32 + 0x1F1E5)
        .map(n => String.fromCodePoint(n))
        .join('')
}