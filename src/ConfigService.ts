import { LuaMapHelper } from './Helpers/LuaMapHelper'

export class ConfigEntry<T> {
    private readonly _table: LuaTable
    private readonly _listeners: Set<(value: T | undefined) => void>
    public readonly Key: ConfigKey

    public constructor(key: ConfigKey, table: LuaTable) {
        this.Key = key
        this._table = table
        this._listeners = new Set()
    }

    public get value(): T | undefined {
        return this._table.get(this.Key)
    }
    public set value(v: T | undefined) {
        this._table.set(this.Key, v)
        for (const listener of this._listeners) {
            listener(v)
        }
    }

    public AddListener(listener: (value: T | undefined) => void) {
        this._listeners.add(listener)
    }

    public RemoveListener(listener: (value: T | undefined) => void) {
        this._listeners.delete(listener)
    }
}

export class ConfigService {
    private readonly _table: LuaTable
    private readonly _entries: LuaMap<ConfigKey, unknown>

    constructor(table: LuaTable) {
        this._table = table
        this._entries = new LuaMap()
    }

    public Get<T>(key: ConfigKey): T | undefined {
        return this.GetEntry<T>(key).value
    }

    public Set<T>(key: ConfigKey, value: T) {
        if (this.Get(key) === value) {
            return
        }

        this.GetEntry<T>(key).value = value
    }

    private CreateEntry<T>(key: ConfigKey): ConfigEntry<T> {
        return new ConfigEntry<T>(key, this._table)
    }

    public GetEntry<T>(key: ConfigKey): ConfigEntry<T> {
        return LuaMapHelper.GetOrCreate<ConfigEntry<T>>(this._entries, key, this.CreateEntry.bind(this))
    }

    public GetConfig(key: string): ConfigService {
        if (!this._table.has(key)) {
            this._table.set(key, {})
        }

        const configTable = this._table.get(key)
        return new ConfigService(configTable)
    }

    public *IterKeys() {
        for (const [key, _] of this._table) {
            yield key
        }
    }
}
