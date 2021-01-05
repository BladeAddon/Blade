local ns, Blade = ...

Blade:RegisterEvent(
    "MERCHANT_SHOW",
    function()
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

Blade:RegisterModule(
    "MODULES.VENDOR.AUTOREPAIR",
    function(...)
    end
)
