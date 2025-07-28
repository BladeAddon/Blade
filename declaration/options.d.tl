global record OptionsMenu
    key: string
    name: string
    table: GroupItem
    new: function (key: string, name: string): OptionsMenu
    get: function (self: OptionsMenu): GroupItem
    set_description: function (self: OptionsMenu, description: string)
    add_toggle: function (self: OptionsMenu, key: string, name: string): ToggleItem
    add_toggle_item: function (self: OptionsMenu, key: string, item: ToggleItem)
    add_range: function (self: OptionsMenu, key: string, name: string, min: number, max: number, step?: number)
    add_range_item: function (self: OptionsMenu, key: string, item: RangeItem)
    add_header: function (self: OptionsMenu, key: string, name: string): HeaderItem
    -- get_entry: function (self: OptionsMenu, key: ConfigKey): ConfigEntry<any>
end
