global enum ItemType
    "toggle"
    "range"
    "group"
    "header"
end

global interface OptionsItem
    name: string | nil
    type: ItemType
    desc: string | nil
    order: number | nil
end

global interface GroupItem is OptionsItem
    -- type = "group"
    args: {string: OptionsItem}
end

global type boolean_getter = function (info: string): boolean
global type boolean_setter = function (info: string, value: boolean)

global interface ToggleItem is OptionsItem
    -- type = "toggle"
    get: boolean_getter | nil
    set: boolean_setter | nil
end

global type number_getter = function (info: string): number
global type number_setter = function (info: string, value: number)

global interface RangeItem is OptionsItem
    -- type = "range"
    min: number
    max: number
    step: number | nil
    get: number_getter | nil
    set: number_setter | nil
end

global interface HeaderItem is OptionsItem
    -- type = "header"
end

global interface IAceConfig
    RegisterOptionsTable: function(name: string, options: GroupItem)
end
