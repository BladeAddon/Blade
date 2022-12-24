import { Bag } from '../../item/bag/Bag'
import { ChatCommand } from '../../chat/command/ChatCommand'
import { ConfigService } from '../../ConfigService'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'
import { CommandHandler } from '../../chat/command/CommandHandler'
import { IEventHandler } from '../../event/IEventHandler'
import { ContainerItem } from '../../item/bag/ContainerItem'
import { ItemInfo } from '../../item/ItemInfo'

export class AutoVendor extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    private readonly _autoSellConfig: ConfigService

    private readonly _shouldSellPredicate: (item: ContainerItem) => boolean

    constructor() {
        super("AutoVendor", "Auto Vendor")

        this._menu.AddToggle("SELL_JUNK", this._localization.Get("SELL_JUNK"))
        this._autoSellConfig = this._moduleSettings.GetConfig("AUTO_SELL")

        this._shouldSellPredicate = this.shouldSell.bind(this)
    }

    private onAutoSellCommand(itemString: string): void {
        const item = ItemInfo.CreateFromName(itemString)
        if (!item) {
            return
        }

        if (this._autoSellConfig.Get(item.itemID)) {
            this._autoSellConfig.Set(item.itemID, undefined)
            this._output.LocalizedPrint("AUTO_SELL_REMOVED", item.itemLink)
        } else {
            this._autoSellConfig.Set(item.itemID, true)
            this._output.LocalizedPrint("AUTO_SELL_ADDED", item.itemLink)
        }
    }

    private shouldSell(item: ContainerItem): boolean {
        return item.IsValid() && (
            ((item.quality === Enum.ItemQuality.Poor && this._moduleSettings.Get<boolean>("SELL_JUNK"))
                || this._autoSellConfig.Get<boolean>(item.itemID))
            && item.sellPrice !== undefined && item.sellPrice > 0 && !item.noValue) === true
    }

    private forceSell(item: ContainerItem): void {
        const newItem = ContainerItem.Create(item.containerIndex, item.slotIndex)
        // if it still exists and is the same item and we also still have a merchant open
        if (newItem?.itemID === item.itemID && C_PlayerInteractionManager.IsInteractingWithNpcOfType(Enum.PlayerInteractionType.Merchant)) {
            // try to sell until it doesn't exist
            C_Timer.After(0, () => {
                item.Use()
                this.forceSell(item)
            })
        }
    }

    private SellTrashItems(): void {
        if (!C_PlayerInteractionManager.IsInteractingWithNpcOfType(Enum.PlayerInteractionType.Merchant)) {
            return
        }

        for (const item of this._bag.SelectItems(this._shouldSellPredicate)) {
            this.forceSell(item)
        }
    }

    private OnManagerFrameShow(type: Enum.PlayerInteractionType) {
        if (type !== Enum.PlayerInteractionType.Merchant) {
            return
        }

        this.SellTrashItems()
    }

    protected OnLoad(): void {
        this._commandHandler.RegisterCommand(new ChatCommand("autosell", this._localization.Get("AUTO_SELL_COMMAND_DESCRIPTION"), this.onAutoSellCommand.bind(this)))

        this._eventHandler.RegisterEvent("PLAYER_INTERACTION_MANAGER_FRAME_SHOW", this.OnManagerFrameShow.bind(this))
    }
}
