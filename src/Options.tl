local options_menu: OptionsMenu = {

}

function OptionsMenu.new(key: string, name: string): OptionsMenu
    local self = {
        key = key,
        name = name,
        table = {
            name = name,
            type = "group",
            args = {}
        }
    }

    return setmetatable(self, { __index = OptionsMenu })
end

-- export class OptionsMenu {
--     protected readonly _name: string
--     protected readonly _table: GroupItem
--     @Inject("SettingsService") private readonly _settings!: ConfigService
--     protected readonly _config: ConfigService
--     constructor(protected readonly key: string, name: string) {
--         this._name = name
--         this._table = {
--             name: this._name,
--             type: "group",
--             args: {}
--         }
--         this._config = this._settings.GetConfig(key)
--     }

--     public get(): GroupItem {
--         return this._table
--     }

--     public setDescription(description: string): void {
--         this._table.desc = description
--     }

--     public AddToggle(key: string, name: string): ToggleItem {
--         const toggleItem: ToggleItem = {
--             name: name,
--             type: "toggle",
--             get: () => this._config.Get<boolean>(key) as boolean,
--             set: (_info, value) => this._config.Set(key, value)
--         }
--         this.AddToggleItem(key, toggleItem)
--         return toggleItem
--     }

--     public AddToggleItem(key: string, item: ToggleItem) {
--         this._table.args[key] = item
--     }

--     public AddRange(key: string, name: string, min: number, max: number, step?: number) {
--         this.AddRangeItem(key, {
--             type: "range",
--             name: name,
--             min: min,
--             max: max,
--             step: step,
--             get: () => this._config.Get<number>(key) ?? 0,
--             set: (_info, value) => this._config.Set(key, value)
--         })
--     }

--     public AddRangeItem(key: string, item: RangeItem) {
--         this._table.args[key] = item
--     }

--     public AddHeader(key: string, name: string): HeaderItem {
--         const item: HeaderItem = { type: "header", name: name }
--         this._table.args[key] = item
--         return item
--     }

--     public GetEntry<T>(key: ConfigKey): ConfigEntry<T> {
--         return this._config.GetEntry<T>(key)
--     }
-- }

-- export class Options extends OptionsMenu {
--     constructor(key: string, name: string) {
--         super(key, name)
--     }

--     public AddMenu(key: string, name: string): OptionsMenu {
--         const menu = new OptionsMenu(key, name)
--         if (!this._table.args) {
--             this._table.args = {}
--         }

--         this._table.args[key] = menu.get()
--         return menu
--     }
-- }
