import { ConfigService } from './ConfigService'
import { Inject } from './tstl-di/src/Inject'

// let value = false

// export const options: OptionsTable = {
//     name: "test",
//     type: "group",
//     args: {
//         autovendor: {
//             name: "autovendor",
//             type: "toggle",
//             get: () => value,
//             set: (_info, val) => value = val
//         }
//     }
// }

export class OptionsMenu {
    protected readonly _name?: string
    protected readonly _table: GroupItem
    @Inject("SettingsService") private readonly _settings!: ConfigService
    protected readonly _config: ConfigService
    constructor(name: string) {
        this._name = name
        this._table = {
            name: this._name,
            type: "group",
            args: {}
        }
        this._config = this._settings.GetConfig(name)
    }

    public get(): GroupItem {
        return this._table
    }

    public AddToggle(key: string, name: string) {
        this.AddToggleItem(key, {
            name: name,
            type: "toggle",
            get: () => this._config.Get<boolean>(key),
            set: (_info, value) => this._config.Set(key, value)
        })
    }

    public AddToggleItem(key: string, item: ToggleItem) {
        this._table.args[key] = item
    }

    public AddRange(key: string, name: string, min: number, max: number, step?: number) {
        this.AddRangeItem(key, {
            type: "range",
            name: name,
            min: min,
            max: max,
            step: step,
            get: () => this._config.Get<number>(key) ?? 0,
            set: (_info, value) => this._config.Set(key, value)
        })
    }

    public AddRangeItem(key: string, item: RangeItem) {
        this._table.args[key] = item
    }
}

export class Options extends OptionsMenu {
    constructor(name: string) {
        super(name)
    }

    public AddMenu(key: string, name: string): OptionsMenu {
        const menu = new OptionsMenu(name)
        if (!this._table.args) {
            this._table.args = {}
        }

        this._table.args[key] = menu.get()
        return menu
    }
}