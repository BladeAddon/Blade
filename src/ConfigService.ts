export class ConfigEntry<T> {
    private readonly _config: ConfigService

    public readonly Key: string

    public constructor(key: string, config: ConfigService) {
        this.Key = key
        this._config = config
    }

    public get value(): T | undefined {
        return this._config.Get(this.Key)
    }
    public set value(v: T | undefined) {
        this._config.Set(this.Key, v)
    }
}

export class ConfigService {
    private readonly _table: LuaTable
    constructor(table: LuaTable) {
        this._table = table
    }

    public Get<T>(key: string|number): T | undefined {
        return this._table.get(key)
    }

    public Set<T>(key: string|number, value: T) {
        if (this.Get(key) === value) {
            return
        }

        this._table.set(key, value)
    }

    public CreateEntry<T>(key: string): ConfigEntry<T> {
        return new ConfigEntry<T>(key, this)
    }

    public GetConfig(key: string): ConfigService {
        if (!this._table.has(key)) {
            this._table.set(key, {})
        }

        const configTable = this._table.get(key)
        return new ConfigService(configTable)
    }
}
