local ns, Blade = ...

local extraSize = 5

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

Blade.Options.Controls.CheckButton = AddCheckButton
