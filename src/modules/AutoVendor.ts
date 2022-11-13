import { Module } from './Module'

class TrashItem {
    constructor(public bag: BAG_ID, public slot: number, public itemSellPrice: number, public name: string, public link: string, public itemID: number) { }

    public Sell(): void {
        UseContainerItem(this.bag, this.slot)
    }
}

export class AutoVendor extends Module {
    constructor() {
        super("AutoVendor")
        const menu = this._options.AddMenu(this.name, this.name)
        menu.AddToggle("ENABLED", "Enabled")
        menu.AddToggle("SELL_JUNK", "Sell Junk")
    }

    public OnLoad(): void {
        const merchantFrame = MerchantFrame
        merchantFrame.HookScript("OnUpdate", (_frame, _sinceLastUpdate) => {
            if (!this.ShouldLoad()) {
                return
            }

            this.GetTrashItem()?.Sell()
        })
    }

    private GetTrashItem(): TrashItem | undefined {
        const sellJunk = this._moduleSettings.Get<boolean>("SELL_JUNK")
        for (let bag = 0; bag < NUM_BAG_SLOTS; bag++) {
            for (let slot = 1; slot < GetContainerNumSlots(bag as BAG_ID); slot++) {
                const [_, count, __, quality, ___, ____, link, _____, ______, itemID] = GetContainerItemInfo(bag as BAG_ID, slot)
                if (itemID !== undefined) {
                    const [name, _, __, ___, ____, _____, ______, _______, ________, _________, vendorPrice] = GetItemInfo(itemID)
                    const shouldSell = (quality === 0 && sellJunk) && vendorPrice && vendorPrice > 0
                    if (shouldSell) {
                        return new TrashItem(bag as BAG_ID, slot, vendorPrice * count, name, link, itemID)
                    }
                }
            }
        }

        return undefined
    }
}