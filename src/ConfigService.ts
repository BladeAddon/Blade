export class ConfigService {
    public readonly _table: LuaTable<string, any>
    constructor(table: LuaTable<string, any>) {
        this._table = table
    }

    public Get<T>(key: string): T | undefined {
        return this._table.get(key)
    }

    public Set<T>(key: string, value: T) {
        this._table.set(key, value)
    }

    public GetConfig(key: string): ConfigService {
        if (!this._table.has(key)) {
            this._table.set(key, {})
        }

        const configTable = this._table.get(key)
        return new ConfigService(configTable)
    }
}
