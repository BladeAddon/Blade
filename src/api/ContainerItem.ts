import { ItemInfo } from './ItemInfo'

export class ContainerItem {
    private constructor(public readonly containerIndex: number, public readonly slotIndex: number, private readonly itemLocation: ItemLocationMixin) {
    }

    public static Create(containerIndex: number, slotIndex: number): ContainerItem | undefined {
        const itemLocation = ItemLocation.CreateFromBagAndSlot(containerIndex, slotIndex)
        if (itemLocation.IsValid()) {
            return new ContainerItem(containerIndex, slotIndex, itemLocation)
        }

        return undefined
    }

    private _item?: ItemInfo
    public get item(): ItemInfo {
        // can this actually be null since we create it from an item in the bag?
        return this._item ??= ItemInfo.Create(this.itemID)!
    }

    private _quality?: Enum.ItemQuality
    public get quality(): Enum.ItemQuality {
        return this._quality ??= C_Item.GetItemQuality(this.itemLocation)
    }

    private _itemID?: number
    public get itemID(): number {
        return this._itemID ??= C_Item.GetItemID(this.itemLocation)
    }

    public get sellPrice(): number {
        return this.item.sellPrice
    }

    public Use(): void {
        C_Container.UseContainerItem(this.containerIndex, this.slotIndex)
    }

    public IsValid(): boolean {
        return this.itemLocation.IsValid()
    }
}
