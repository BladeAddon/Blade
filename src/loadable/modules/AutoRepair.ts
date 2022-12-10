import { IEventHandler } from '../../event/IEventHandler'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

export class AutoRepair extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    constructor() {
        super("AutoRepair", "Auto Repair")

        this._menu.AddToggle("GUILD_REPAIR", "Guild Repair").desc = this._localization.Get("GUILD_REPAIR_DESCRIPTION")
    }

    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("PLAYER_INTERACTION_MANAGER_FRAME_SHOW", this.OnManagerFrameShow.bind(this))
    }

    private OnManagerFrameShow(type: Enum.PlayerInteractionType) {
        if (type !== Enum.PlayerInteractionType.Merchant) {
            return
        }

        if (!this.ShouldLoad()) {
            return
        }

        if (!CanMerchantRepair()) {
            return
        }

        const [repairCost, canRepair] = GetRepairAllCost()
        if (canRepair) {
            RepairAllItems(this._moduleSettings.Get<boolean>("GUILD_REPAIR") && CanGuildBankRepair() && GetGuildBankWithdrawMoney() >= repairCost)
            this._output.LocalizedPrint("REPAIRING_COST", GetMoneyString(repairCost))
        }
    }
}
