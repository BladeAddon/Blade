export class MapHelper {
    public static GetOrCreate<TValue>(map: Map<ConfigKey, TValue>, key: ConfigKey, valueFactory: (key: ConfigKey) => TValue): TValue {
        let value = map.get(key)
        if (value !== undefined) {
            return value
        }

        value = valueFactory(key)
        map.set(key, value)
        return value
    }
}
