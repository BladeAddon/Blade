local ns, Blade = ...

Blade.Options = {}

local optionsPanel = CreateFrame("FRAME", Blade.AddonName .. "OptionsPanel")
optionsPanel.name = Blade.AddonName

local function OnOkay(self, ...)
end
local function OnCancel(self, ...)
end
local function OnDefault(self, ...)
end
optionsPanel.okay = OnOkay
optionsPanel.cancel = OnCancel
optionsPanel.default = OnDefault

Blade.Options.Panel = optionsPanel

local optionsChildren = {}
Blade.Options.Children = optionsChildren

local function AddCheckButton(panel, name, text, tooltipText)
    local function BindToSetting(frame, setting, key)
        panel:OnOkay(
            function(self)
                Blade:SetSetting(setting, key, frame:GetChecked())
            end
        )
        panel:OnRefresh(
            function(self)
                frame:SetChecked(Blade:GetSetting(setting, key))
            end
        )
    end

    local button = CreateFrame("CheckButton", panel.name .. name, panel, "InterfaceOptionsCheckButtonTemplate")
    -- apparently InterfaceOptionsCheckButtonTemplate needs an onclick handler
    button:SetScript(
        "OnClick",
        function(self)
            local tick = self:GetChecked()
        end
    )
    button.BindToSetting = BindToSetting
    button.Text:SetText(text)
    button.tooltipText = text
    button.tooltipRequirement = tooltipText

    return button
end

function Blade:CreateSubOptions(name)
    if optionsChildren[name] then
        return optionsChildren[name]
    end

    local frame = CreateFrame("FRAME", "BLADE_" .. name .. "OptionsPanel")
    frame.name = name
    frame.parent = optionsPanel.name

    frame.onOkayHandlers = {}
    frame.onCancelHandlers = {}
    frame.onRefreshHandlers = {}

    frame.AddCheckButton = AddCheckButton

    frame.OnOkay = function(f, handler)
        table.insert(f.onOkayHandlers, handler)
    end
    frame.OnCancel = function(f, handler)
        table.insert(f.onCancelHandlers, handler)
    end
    frame.OnRefresh = function(f, handler)
        table.insert(f.onRefreshHandlers, handler)
    end

    frame.okay = function(f, ...)
        for _, v in ipairs(f.onOkayHandlers) do
            v(f)
        end
    end
    frame.cancel = function(f, ...)
        for _, v in ipairs(f.onCancelHandlers) do
            v(f)
        end
    end
    frame.refresh = function(f, ...)
        for _, v in ipairs(f.onRefreshHandlers) do
            v(f)
        end
    end

    -- table.insert(optionsChildren, frame)
    optionsChildren[name] = frame
    if Blade.Loaded then
        InterfaceOptions_AddCategory(frame)
    end

    return frame
end

function Blade:GetSettings(name)
    if not BLADEDATA.SETTINGS then
        BLADEDATA.SETTINGS = {}
    end

    if not BLADEDATA.SETTINGS[name] then
        BLADEDATA.SETTINGS[name] = {}
    end

    return BLADEDATA.SETTINGS[name]
end

function Blade:GetSetting(name, key, defaultValue)
    if self:GetSettings(name)[key] == nil then
        self:SetSetting(name, key, defaultValue)
    end

    return self:GetSettings(name)[key]
end

function Blade:SetSetting(name, key, value)
    self:GetSettings(name)[key] = value
end

Blade:Init(
    function()
        if not BLADEDATA.SETTINGS then
            BLADEDATA.SETTINGS = {}
        end

        InterfaceOptions_AddCategory(optionsPanel)

        for _, v in ipairs(optionsChildren) do
            InterfaceOptions_AddCategory(v)
        end
    end
)
