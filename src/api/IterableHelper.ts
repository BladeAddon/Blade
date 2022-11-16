export function* map<T, F>(iter: IterableIterator<T>, selector: (source: T) => F) {
    for (const item of iter) {
        yield selector(item)
    }
}

export function* take<T>(iter: IterableIterator<T>, n: number) {
    let count = 0
    for (const item of iter) {
        if (count >= n) {
            return
        }
        yield item
        count++
    }
}

export function forEach<T>(iter: IterableIterator<T>, callback: (source: T) => void): void {
    for (const item of iter) {
        callback(item)
    }
}

export function* filter<T>(iter: IterableIterator<T>, selector: (source: T) => boolean) {
    for (const item of iter) {
        if (selector(item)) {
            yield item
        }
    }
}
