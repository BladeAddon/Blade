import { Item } from './Item'

export class ContainerItem {
    private _containerItemInfo: ContainerItemInfo | undefined
    private _item: Item | undefined
    constructor(public readonly containerIndex: number, public readonly slotIndex: number) {
    }

    public get containerItemInfo(): ContainerItemInfo {
        return this._containerItemInfo ??= C_Container.GetContainerItemInfo(this.containerIndex, this.slotIndex)
    }

    /**The icon texture (FileID) for the item in the specified bag slot. */
    public get iconFileID(): number {
        return this.containerItemInfo.iconFileID
    }

    /**
     * @deprecated use stackCount
     *
     * The number of items in the specified bag slot.
     */
    public get itemCount(): number {
        return this.containerItemInfo.stackCount
    }

    /**
     * The number of items in the specified bag slot.
     */
    public get stackCount(): number {
        return this.containerItemInfo.stackCount
    }

    /**True if the item is locked by the server, false otherwise. */
    public get locked(): boolean {
        return this.containerItemInfo.isLocked
    }

    /**The Quality of the item. */
    public get quality(): Enum.ItemQuality | undefined {
        return this.containerItemInfo.quality
    }

    /**True if the item can be "read" (as in a book), false otherwise. */
    public get readable(): boolean {
        return this.containerItemInfo.isReadable
    }

    /**
    * @deprecated use hasLoot
    *
    * True if the item is a temporary container containing items that can be looted, false otherwise.
    */
    public get lootable(): boolean {
        return this.containerItemInfo.hasLoot
    }

    /**True if the item is a temporary container containing items that can be looted, false otherwise. */
    public get hasLoot(): boolean {
        return this.containerItemInfo.hasLoot
    }

    /**The itemLink of the item in the specified bag slot. */
    public get itemLink(): string {
        return this.containerItemInfo.hyperlink
    }

    /**True if the item is grayed-out during the current inventory search, false otherwise. */
    public get isFiltered(): boolean {
        return this.containerItemInfo.isFiltered
    }

    /**True if the item has no gold value, false otherwise. */
    public get noValue(): boolean {
        return this.containerItemInfo.hasNoValue
    }

    /**The unique ID for the item in the specified bag slot. */
    public get itemID(): number {
        return this.containerItemInfo.itemID
    }

    /**True if the item is bound to the current character, false otherwise. */
    public get isBound(): boolean {
        return this.containerItemInfo.isBound
    }

    public get item(): Item | undefined {
        return this._item ??= new Item(this.itemID)
    }

    /**The localized name of the item. */
    public get name(): string | undefined {
        return this.item?.itemName
    }

    /**The base item level, not including upgrades. See GetDetailedItemLevelInfo() for getting the actual item level. */
    public get itemLevel(): number | undefined {
        return this.item?.itemLevel
    }

    /**The vendor price in copper, or 0 for items that cannot be sold. */
    public get sellPrice(): number | undefined {
        return this.item?.sellPrice
    }

    public Use(): void {
        C_Container.UseContainerItem(this.containerIndex, this.slotIndex)
    }
}
