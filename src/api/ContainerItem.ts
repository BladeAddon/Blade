import { Item } from './Item'

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

    private _item?: Item
    public get item(): Item {
        return this._item ??= new Item(this.itemID)
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
        return this.item.sellPrice!
    }

    public Use(): void {
        C_Container.UseContainerItem(this.containerIndex, this.slotIndex)
    }
}
