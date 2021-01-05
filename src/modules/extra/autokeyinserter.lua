local ns, Blade = ...

local moduleName = "MODULES.EXTRA.AUTOKEYINSERTER"

local keystone_item_id = 180653

Blade:RegisterEvent(
    "CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN",
    function(...)
        local bag, slot = Blade:FindBagItemByID(keystone_item_id)
        if bag and slot then
            UseContainerItem(bag, slot)
            return
        end
    end
)

local options = Blade:CreateSubOptions("Auto Key inserter")
local enableButton = options:AddCheckButton("ENABLED", "Enabled")
enableButton:SetPoint("TOPLEFT", 10, -10)
options.okay = function(self)
    Blade:SetSetting(moduleName, "ENABLED", enableButton:GetChecked())
end
options.refresh = function(self)
    enableButton:SetChecked(Blade:GetSetting(moduleName, "ENABLED"))
end
Blade:AddOptionsPanel(options)

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
    end
)
