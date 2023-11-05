export class LuaMapHelper {
    public static GetOrCreate<TValue>(map: LuaMap<ConfigKey, unknown>, key: ConfigKey, valueFactory: (key: ConfigKey) => TValue): TValue {
        let value = map.get(key) as TValue | undefined
        if (value !== undefined) {
            return value
        }

        value = valueFactory(key)
        map.set(key, value)
        return value
    }
}
