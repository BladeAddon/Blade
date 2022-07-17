local ns, Blade = ...

local extraSize = 5

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

Blade.Options.Controls.Slider = AddSlider
