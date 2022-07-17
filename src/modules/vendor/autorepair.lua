local ns, Blade = ...

local moduleName = "MODULES.VENDOR.AUTOREPAIR"

Blade:RegisterEvent(
    "MERCHANT_SHOW",
    function()
        if not Blade:GetSetting(moduleName, "ENABLED") then
            return
        end

        if not CanMerchantRepair() then
            return
        end

        local repairCost, canRepair = GetRepairAllCost()
        if canRepair then
            RepairAllItems(
                Blade:GetSetting(moduleName, "GUILD_REPAIR") and CanGuildBankRepair() and
                    GetGuildBankWithdrawMoney() >= repairCost
            )
            Blade:Print("Repairing has cost: " .. GetMoneyString(repairCost))
        end
    end
)

local options = Blade:CreateSubOptions("Auto Repair")
local enableButton =
    options:AddCheckButton("ENABLED", "Enabled", "Automatically repair everything when a vendor is opened")
enableButton:BindToSetting(moduleName, "ENABLED")

local guildRepairButton =
    options:AddCheckButton(
    "GUILD_REPAIR",
    "Guild repair",
    "Try to use guild repair if you are allowed and have sufficient funds available"
)
guildRepairButton:BindToSetting(moduleName, "GUILD_REPAIR")

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
        Blade:GetSetting(moduleName, "GUILD_REPAIR", true)
    end
)
