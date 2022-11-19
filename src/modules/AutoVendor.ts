import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { ContainerItem } from '../api/ContainerItem'
import { Item } from '../api/Item'
import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

export class AutoVendor extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler

    private readonly _autoSellConfig: ConfigService

    constructor() {
        super("AutoVendor")

        this._menu.AddToggle("SELL_JUNK", "Sell Junk")
        this._commandHandler.RegisterCommand(new ChatCommand("autosell", "Add or remove item to/from autosell list by linking it to this command with shift+click", this.onAutoSellCommand.bind(this)))
        this._autoSellConfig = this._moduleSettings.GetConfig("AUTO_SELL")
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

    protected OnLoad(): void {
        const merchantFrame = MerchantFrame
        merchantFrame.HookScript("OnUpdate", (_frame, _sinceLastUpdate) => {
            if (!this.ShouldLoad()) {
                return
            }

            this.GetTrashItems().slice(0, 4).forEach(x => x.Use())
        })
    }

    private shouldSell(item: ContainerItem): boolean {
        return (item.containerItemInfo !== undefined &&
            ((item.quality === Enum.ItemQuality.Poor && this._moduleSettings.Get<boolean>("SELL_JUNK")) || this._autoSellConfig.Get<boolean>(item.itemID))
            && item.sellPrice !== undefined && item.sellPrice > 0) === true
    }

    private GetTrashItems(): ContainerItem[] {
        const items = []
        for (let bag = 0; bag <= NUM_BAG_SLOTS; bag++) {
            for (let slot = 1; slot <= C_Container.GetContainerNumSlots(bag); slot++) {
                const containerItem = new ContainerItem(bag as BAG_ID, slot)
                if (this.shouldSell(containerItem)) {
                    items.push(containerItem)
                }
            }
        }

        return items
    }
}
