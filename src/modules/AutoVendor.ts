import { Bag } from '../api/Bag'
import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { ContainerItem } from '../api/ContainerItem'
import { IEventHandler } from '../api/IEventHandler'
import { ItemInfo } from '../api/ItemInfo'
import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

export class AutoVendor extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    private readonly _autoSellConfig: ConfigService

    private readonly _shouldSellPredicate: (item: ContainerItem) => boolean

    private _temporaryIgnoreList: LuaMap<string, number> | undefined

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
        return item.IsValid() && !this._temporaryIgnoreList?.has(item.lookupKey) && (
            ((item.quality === Enum.ItemQuality.Poor && this._moduleSettings.Get<boolean>("SELL_JUNK"))
                || this._autoSellConfig.Get<boolean>(item.itemID))
            && item.sellPrice !== undefined && item.sellPrice > 0) === true
    }

    private SellTrashItems(): void {
        if (this._temporaryIgnoreList) {
            for (const [item, time] of this._temporaryIgnoreList) {
                if (GetTime() - time > 0.3) {
                    this._temporaryIgnoreList?.delete(item)
                }
            }
        }

        if (!C_PlayerInteractionManager.IsInteractingWithNpcOfType(Enum.PlayerInteractionType.Merchant)) {
            return
        }

        const itemsToSell = this._bag.FindItems(this._shouldSellPredicate)
        if (itemsToSell.length === 0) {
            return
        }

        for (const item of itemsToSell) {
            item.Use()
            this._temporaryIgnoreList?.set(item.lookupKey, GetTime())
        }

        // recheck for items that failed to sell
        C_Timer.After(1, this.SellTrashItems.bind(this))
    }

    private OnManagerFrameShow(type: Enum.PlayerInteractionType) {
        if (type !== Enum.PlayerInteractionType.Merchant) {
            return
        }

        this._temporaryIgnoreList = new LuaMap()
        this.SellTrashItems()
    }

    protected OnLoad(): void {
        this._commandHandler.RegisterCommand(new ChatCommand("autosell", this._localization.Get("AUTO_SELL_COMMAND_DESCRIPTION"), this.onAutoSellCommand.bind(this)))

        this._eventHandler.RegisterEvent("PLAYER_INTERACTION_MANAGER_FRAME_SHOW", this.OnManagerFrameShow.bind(this))
    }
}
