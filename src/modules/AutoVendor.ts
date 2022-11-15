import { ContainerItem } from '../api/ContainerItem'
import { Module } from './Module'

export class AutoVendor extends Module {
    constructor() {
        super("AutoVendor")

        this._menu.AddToggle("SELL_JUNK", "Sell Junk")
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
        return (item.itemID !== undefined &&
            (item.quality === Enum.ItemQuality.Poor && this._moduleSettings.Get<boolean>("SELL_JUNK"))
            && item.sellPrice !== undefined && item.sellPrice > 0) === true
    }

    private GetTrashItems(): ContainerItem[] {
        const items = []
        for (let bag = 0; bag < NUM_BAG_SLOTS; bag++) {
            for (let slot = 1; slot < GetContainerNumSlots(bag as BAG_ID); slot++) {
                const containerItem = new ContainerItem(bag as BAG_ID, slot)
                if (this.shouldSell(containerItem)) {
                    items.push(containerItem)
                }
            }
        }

        return items
    }
}
