import { ItemInfo } from '../ItemInfo'

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

    private _containerItemInfo?: ContainerItemInfo
    public get containerItemInfo(): ContainerItemInfo {
        return this._containerItemInfo ??= C_Container.GetContainerItemInfo(this.containerIndex, this.slotIndex)!
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

    private _name?: string
    public get name(): string {
        return this._name ??= C_Item.GetItemName(this.itemLocation)
    }

    private _noValue?: boolean
    public get noValue(): boolean {
        return this._noValue ??= this.containerItemInfo.hasNoValue
    }

    public Use(): void {
        C_Container.UseContainerItem(this.containerIndex, this.slotIndex)
    }

    public IsValid(): boolean {
        return this.itemLocation.IsValid()
    }

    private _lookupKey?: string
    public get lookupKey(): string {
        return this._lookupKey ??= `${this.containerIndex}_${this.slotIndex}`
    }

    private _itemLink?: string
    public get itemLink(): string {
        return this._itemLink ??= C_Container.GetContainerItemLink(this.containerIndex, this.slotIndex)
    }
}
