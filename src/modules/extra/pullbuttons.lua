local ns, Blade = ...

local moduleName = "MODULES.EXTRA.PULLBUTTONS"

local options = Blade:CreateSubOptions("Pull Buttons")
local enableButton =
    options:AddCheckButton(
    "ENABLED",
    "Enabled",
    "Show Pull and Readycheck buttons. Changing this needs a reload to remove or show frames"
)
enableButton:SetPoint("TOPLEFT", 10, -10)
enableButton:BindToSetting(moduleName, "ENABLED")

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)

        if not Blade:GetSetting(moduleName, "ENABLED") then
            return
        end

        local buttonSizeW = 48
        local buttonSizeH = 32

        local buttonFrame = Blade:CreateFrame()
        buttonFrame:Show()

        local pull5 =
            Blade:CreateButton(
            function(frame, button, down)
                Blade:SendChat("/pull 5")
            end,
            "Pull5",
            buttonFrame
        )
        pull5:SetSize(buttonSizeW, buttonSizeH)
        pull5:Show()
        pull5:AddText("Pull 5")

        local pull10 =
            Blade:CreateButton(
            function(frame, button, down)
                Blade:SendChat("/pull 10")
            end,
            "Pull10",
            buttonFrame
        )
        pull10:SetSize(buttonSizeW, buttonSizeH)
        pull10:Show()
        pull10:AddText("Pull 10")

        local rdycheck =
            Blade:CreateButton(
            function(frame, button, down)
                Blade:SendChat("/readycheck")
            end,
            "ReadyCheck",
            buttonFrame
        )
        rdycheck:SetSize(buttonSizeW, buttonSizeH)
        rdycheck:Show()
        rdycheck:AddText("Ready Check")

        buttonFrame:HandleFramePos("PullButtons")
    end
)
