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
            RepairAllItems(CanGuildBankRepair() and GetGuildBankWithdrawMoney() >= repairCost)
            print("Repairing has cost: " .. GetMoneyString(repairCost))
        end
    end
)

local options = Blade:CreateSubOptions("Auto Repair")
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
    end
)
