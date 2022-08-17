local ns, Blade = ...

local moduleName = "MODULES.EXTRA.BUFFCOUNTS"

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
        Blade:GetSetting(moduleName, "BUFF_COUNT", BUFFS_PER_ROW)

        local options = Blade:CreateSubOptions("Buffs per Row")
        options:AddCheckButton("ENABLED", "Enabled", "Change the number of Buffs per Row"):BindToSetting(
            moduleName,
            "ENABLED"
        )

        -- panel, name, minValue, maxValue, stepValue, text, tooltipText
        options:AddSlider("BUFF_COUNT", 1, 40, 1, "Buffs per Row", "Number of Buffs to display per Row"):BindToSetting(
            moduleName,
            "BUFF_COUNT"
        )

        if not Blade:GetSetting(moduleName, "ENABLED") then
            return
        end

        options:OnOkay(
            function(...)
                BUFFS_PER_ROW = Blade:GetSetting(moduleName, "BUFF_COUNT")
            end
        )

        Blade:RegisterEvent(
            "PLAYER_ENTERING_WORLD",
            function(...)
                C_Timer.After(
                    0.3,
                    function()
                        BUFFS_PER_ROW = Blade:GetSetting(moduleName, "BUFF_COUNT")
                    end
                )
            end
        )
    end
)
