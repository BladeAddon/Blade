import { Bag } from '../api/Bag'
import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { ContainerItem } from '../api/ContainerItem'
import { IEventHandler } from '../api/IEventHandler'
import { Item } from '../api/Item'
import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

const waitTime = 3

export class AutoVendor extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    private readonly _autoSellConfig: ConfigService

    private readonly _shouldSellPredicate: (item: ContainerItem) => boolean

    private _timeSinceLastMerchantFrameUpdate: number = 0
    private _waitingForWork = false

    constructor() {
        super("AutoVendor")

        this._menu.AddToggle("SELL_JUNK", "Sell Junk")
        this._commandHandler.RegisterCommand(new ChatCommand("autosell", "Add or remove item to/from autosell list by linking it to this command with shift+click", this.onAutoSellCommand.bind(this)))
        this._autoSellConfig = this._moduleSettings.GetConfig("AUTO_SELL")
        this._eventHandler.RegisterEvent("MERCHANT_SHOW", () => this._waitingForWork = false)

        this._shouldSellPredicate = this.shouldSell.bind(this)
    }

    private onAutoSellCommand(itemString: string): void {
        const item = new Item(itemString)
        if (!item.itemID || !item.itemLink) {
            return
        }

        if (this._autoSellConfig.Get(item.itemID)) {
            this._autoSellConfig.Set(item.itemID, undefined)
            this._output.Print(`Removed ${item.itemLink} from auto sell`)
        } else {
            this._autoSellConfig.Set(item.itemID, true)
            this._output.Print(`Added ${item.itemLink} to auto sell`)
        }
    }

    private shouldSell(item: ContainerItem): boolean {
        return (item.containerItemInfo !== undefined &&
            ((item.quality === Enum.ItemQuality.Poor && this._moduleSettings.Get<boolean>("SELL_JUNK")) || this._autoSellConfig.Get<boolean>(item.itemID))
            && item.sellPrice !== undefined && item.sellPrice > 0) === true
    }

    private SellTrashItems(): void {
        const trashItems = Array.from(Bag.FindItems(this._shouldSellPredicate))
        if (trashItems.length === 0) {
            this._waitingForWork = true
            return
        }

        this._waitingForWork = false

        for (const item of trashItems) {
            item.Use()
        }
    }

    protected OnLoad(): void {
        const merchantFrame = MerchantFrame
        merchantFrame.HookScript("OnUpdate", (elapsed: number) => {
            if (!this.ShouldLoad()) {
                return
            }

            this._timeSinceLastMerchantFrameUpdate = this._timeSinceLastMerchantFrameUpdate + elapsed

            if (!this._waitingForWork) {
                this.SellTrashItems()
            } else if (this._timeSinceLastMerchantFrameUpdate > waitTime) {
                this._timeSinceLastMerchantFrameUpdate = this._timeSinceLastMerchantFrameUpdate - waitTime
                this.SellTrashItems()
            }
        })
    }
}
