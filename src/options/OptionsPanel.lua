local ns, Blade = ...

local extraSize = 5

Blade.Options = {}

local optionsChildren = {}
Blade.Options.Children = optionsChildren

local function VerticalLayout(panel)
    local kids = {panel:GetChildren()}

    local lastChild = nil
    if #kids > 0 then
        local padding = panel.padding or 0
        local totalHeight = padding
        local visibleHeight = padding
        local maxWidth = 0
        for i, child in ipairs(kids) do
            local height = child:GetHeight()
            local width = child:GetWidth()
            if child:IsShown() then
                child:ClearAllPoints()
                if not lastChild then
                    child:SetPoint("TOPLEFT", panel, "TOPLEFT", padding, -(padding))
                else
                    child:SetPoint(
                        "TOPLEFT",
                        lastChild,
                        "BOTTOMLEFT",
                        0,
                        child.ExtraHeight and -child:ExtraHeight() or 0
                    )
                end
                visibleHeight = visibleHeight + height
            end
            totalHeight = totalHeight + height
            if width > maxWidth then
                maxWidth = width
            end

            lastChild = child
        end

        panel:SetWidth(maxWidth)
        panel:SetHeight(totalHeight)
    end
end

local function HorizontalLayout(panel)
    local kids = {panel:GetChildren()}

    if #kids > 0 then
        local lastChild = nil
        local padding = panel.padding or 0
        local totalWidth = padding
        local visibleWidth = padding
        local maxHeight = 0
        for i, child in ipairs(kids) do
            local height = child:GetHeight()
            local width = child:GetWidth()
            if child:IsShown() then
                child:ClearAllPoints()
                if not lastChild then
                    child:SetPoint("TOPLEFT", panel, "TOPLEFT", padding, -padding)
                else
                    child:SetPoint(
                        "TOPLEFT",
                        lastChild,
                        "TOPRIGHT",
                        lastChild.ExtraWidth and lastChild:ExtraWidth() or 0,
                        0
                    )
                end
                -- child:SetPoint("TOPLEFT", visibleWidth, panel.padding or 0)
                visibleWidth = visibleWidth + width
            end
            totalWidth = totalWidth + width
            if height > maxHeight then
                maxHeight = height
            end

            lastChild = child
        end

        panel:SetWidth(totalWidth)
        panel:SetHeight(maxHeight)
    end
end

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

    button.ExtraWidth = function(self)
        return self.Text and (self.Text:GetWidth() + extraSize) or 0
    end

    button.BindToSetting = BindToSetting
    button.Text:SetText(text)
    button.tooltipText = text
    button.tooltipRequirement = tooltipText

    panel:Layout()

    return button
end

local function AddSlider(panel, name, minValue, maxValue, stepValue, text, tooltipText)
    local function BindToSetting(frame, setting, key)
        panel:OnOkay(
            function(self)
                Blade:SetSetting(setting, key, frame:GetValue())
            end
        )
        panel:OnRefresh(
            function(self)
                frame:SetValue(Blade:GetSetting(setting, key))
            end
        )
    end

    local slider = CreateFrame("Slider", panel.name .. name, panel, "OptionsSliderTemplate")

    slider.ExtraHeight = function(self)
        return self.Text and (self.Text:GetHeight() + extraSize) or 0
    end

    slider.BindToSetting = BindToSetting
    slider.header = text
    slider.Text:SetText(slider.header)
    slider.tooltipText = text
    slider.tooltipRequirement = tooltipText
    slider:SetMinMaxValues(minValue, maxValue)
    slider:SetValueStep(stepValue)
    slider:SetObeyStepOnDrag(true)
    slider:SetScript(
        "OnValueChanged",
        function(self, value)
            self.Text:SetText(self.header .. "(" .. value .. ")")
            panel:Layout()
        end
    )

    panel:Layout()

    return slider
end

local function CreateSubOptions(panel, name)
    local frameName = (panel.fullName or panel.name or "BLADE") .. "_" .. name .. "#OptionsPanel"

    -- if optionsChildren[frameName] then
    --     return optionsChildren[frameName]
    -- end

    for _, v in ipairs(optionsChildren) do
        if v and v.fullName == frameName then
            return v
        end
    end

    local frame = CreateFrame("FRAME", frameName)
    frame.children = {}
    frame.CreateSubOptions = CreateSubOptions
    frame.name = name
    frame.fullName = frameName
    frame.parent = panel.name

    frame.padding = 10

    frame.onOkayHandlers = {}
    frame.onCancelHandlers = {}
    frame.onRefreshHandlers = {}

    frame.AddCheckButton = AddCheckButton
    frame.AddSlider = AddSlider
    frame.HorizontalLayout = HorizontalLayout
    frame.VerticalLayout = VerticalLayout

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
    if panel and panel.children then
        table.insert(panel.children, frame)
    end
    -- table.insert(panel.children or optionsChildren, frame)
    -- optionsChildren[frameName] = frame
    if Blade.Loaded then
        InterfaceOptions_AddCategory(frame)
    end

    return frame
end

-- local optionsPanel = CreateFrame("FRAME", Blade.AddonName .. "#OptionsPanel")
local optionsPanel = CreateSubOptions({}, Blade.AddonName)
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

-- optionsPanel.CreateSubOptions = CreateSubOptions

function Blade:CreateSubOptions(name)
    return optionsPanel:CreateSubOptions(name)
end

Blade:Init(
    function()
        -- InterfaceOptions_AddCategory(optionsPanel)

        -- for _, v in pairs(optionsChildren) do
        --     InterfaceOptions_AddCategory(v)
        -- end

        local children = {}
        local function walkChildren(panel, array)
            print("panel: " .. panel.name .. "; parent: " .. tostring(panel.parent))
            table.insert(array, panel)
            for _, v in ipairs(panel.children) do
                walkChildren(v, array)
            end
        end
        walkChildren(optionsPanel, children)
        for _, v in ipairs(children) do
            InterfaceOptions_AddCategory(v)
        end
    end
)
