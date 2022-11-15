import { IEventHandler } from '../api/IEventHandler'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

export class AutoRepair extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    constructor() {
        super("AutoRepair")

        this._menu.AddToggle("GUILD_REPAIR", "Guild Repair").desc = "Try to use guild repair if you are allowed and have sufficient funds available"
    }
    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("MERCHANT_SHOW", this.OnMerchantShow.bind(this))
    }

    private OnMerchantShow(): void {
        if (!this.ShouldLoad()) {
            return
        }

        if (!CanMerchantRepair()) {
            return
        }

        const [repairCost, canRepair] = GetRepairAllCost()
        if (canRepair) {
            RepairAllItems(this._moduleSettings.Get<boolean>("GUILD_REPAIR") && CanGuildBankRepair() && GetGuildBankWithdrawMoney() >= repairCost)
            this._output.Print(`Repairing has cost ${GetMoneyString(repairCost)}`)
        }
    }
}