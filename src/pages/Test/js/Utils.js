import parseHocon from 'hocon-parser'

export const fetchHocon = async (url) => {
    return fetch(url)
        .then((res) => res.text())
        .then((value) => parseHocon(value));
}
