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
local enableButton = options:AddCheckButton("ENABLED", "Enabled")
enableButton:SetPoint("TOPLEFT", 10, -10)
enableButton:BindToSetting(moduleName, "ENABLED")
Blade:AddOptionsPanel(options)

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
        Blade:GetSetting(moduleName, "GUILD_REPAIR", true)
    end
)
