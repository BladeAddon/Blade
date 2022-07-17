local ns, Blade = ...

local controls = Blade.Options.Controls
local layouting = Blade.Options.Layouting

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

function Blade:CreateSubOptions(name)
    if optionsChildren[name] then
        return optionsChildren[name]
    end

    local frame = CreateFrame("FRAME", "BLADE_" .. name .. "OptionsPanel")
    frame.name = name
    frame.parent = optionsPanel.name

    frame.padding = 10

    frame.onOkayHandlers = {}
    frame.onCancelHandlers = {}
    frame.onRefreshHandlers = {}

    frame.AddCheckButton = controls.CheckButton
    frame.AddSlider = controls.Slider
    frame.HorizontalLayout = layouting.HorizontalLayout
    frame.VerticalLayout = layouting.VerticalLayout

    frame.UseAutoLayout = true
    frame.AutoLayout = frame.VerticalLayout

    function frame:Layout()
        if self.UseAutoLayout then
            self:AutoLayout()
        end
    end

    function frame:OnOkay(handler)
        table.insert(self.onOkayHandlers, handler)
    end
    function frame:OnCancel(handler)
        table.insert(self.onCancelHandlers, handler)
    end
    function frame:OnRefresh(handler)
        table.insert(self.onRefreshHandlers, handler)
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

        f:Layout()
    end

    -- table.insert(optionsChildren, frame)
    optionsChildren[name] = frame
    if Blade.Loaded then
        InterfaceOptions_AddCategory(frame)
    end

    return frame
end

Blade:Init(
    function()
        InterfaceOptions_AddCategory(optionsPanel)

        for _, v in pairs(optionsChildren) do
            InterfaceOptions_AddCategory(v)
        end
    end
)
