local ns, Blade = ...

Blade.Options = {}

local optionsPanel = CreateFrame("FRAME", Blade.AddonName .. "OptionsPanel")
optionsPanel.name = Blade.AddonName
Blade.Options.Panel = optionsPanel

local optionsChildren = {}
Blade.Options.Children = optionsChildren

function Blade:AddOptionsPanel(panel)
    if not panel.parent then
        panel.parent = optionsPanel.name
    end

    table.insert(optionsChildren, panel)
    if Blade.Loaded then
        InterfaceOptions_AddCategory(panel)
    end
end

function Blade:CreateSubOptions(name)
    local frame = CreateFrame("FRAME", "BLADE_" .. name .. "OptionsPanel")
    frame.name = name
    frame.parent = optionsPanel.name

    return frame
end

-- local generalOptions = Blade:CreateSubOptions("General")
-- Blade:AddOptionsPanel(generalOptions)

Blade:Init(
    function()
        InterfaceOptions_AddCategory(optionsPanel)

        for _, v in ipairs(optionsChildren) do
            InterfaceOptions_AddCategory(v)
        end
    end
)
