local ns, Blade = ...

local moduleName = "MODULES.EXTRA.AUTOKEYINSERTER"

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)

        local keystone_item_id = 180653

        Blade:RegisterEvent(
            "CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN",
            function(...)
                if not Blade:GetSetting(moduleName, "ENABLED") then
                    return
                end

                local bag, slot = Blade:FindBagItemByID(keystone_item_id)
                if bag and slot then
                    UseContainerItem(bag, slot)
                    return
                end
            end
        )

        local options = Blade:CreateSubOptions("Auto Key inserter")
        local enableButton =
            options:AddCheckButton("ENABLED", "Enabled", "Automatically insert Mythic Keystone into the Font")
        enableButton:BindToSetting(moduleName, "ENABLED")
    end
)
