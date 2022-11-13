import { Item } from './Item'

export class ContainerItem {
    private _containerItemInfo: ContainerItemInfoResult | undefined
    private _item: Item | undefined
    constructor(public readonly bag_id: BAG_ID, public readonly slot: number) {
    }

    public get containerItemInfo(): ContainerItemInfoResult {
        return this._containerItemInfo ??= GetContainerItemInfo(this.bag_id, this.slot)
    }

    /**The icon texture (FileID) for the item in the specified bag slot. */
    public get texture(): string {
        return this.containerItemInfo[0]
    }

    /**The number of items in the specified bag slot. */
    public get itemCount(): number {
        return this.containerItemInfo[1]
    }

    /**True if the item is locked by the server, false otherwise. */
    public get locked(): boolean {
        return this.containerItemInfo[2]
    }

    /**The Quality of the item. */
    public get quality(): number {
        return this.containerItemInfo[3]
    }

    /**True if the item can be "read" (as in a book), false otherwise. */
    public get readable(): boolean {
        return this.containerItemInfo[4]
    }

    /**True if the item is a temporary container containing items that can be looted, false otherwise. */
    public get lootable(): boolean {
        return this.containerItemInfo[5]
    }

    /**The itemLink of the item in the specified bag slot. */
    public get itemLink(): string {
        return this.containerItemInfo[6]
    }

    /**True if the item is grayed-out during the current inventory search, false otherwise. */
    public get isFiltered(): boolean {
        return this.containerItemInfo[7]
    }

    /**True if the item has no gold value, false otherwise. */
    public get noValue(): boolean {
        return this.containerItemInfo[8]
    }

    /**The unique ID for the item in the specified bag slot. */
    public get itemID(): number {
        return this.containerItemInfo[9]
    }

    /**True if the item is bound to the current character, false otherwise. */
    public get isBound(): boolean {
        return this.containerItemInfo[10]
    }

    public get item(): Item {
        return this._item ??= new Item(this.itemID)
    }

    /**The localized name of the item. */
    public get name(): string {
        return this.item.itemName
    }

    /**The base item level, not including upgrades. See GetDetailedItemLevelInfo() for getting the actual item level. */
    public get itemLevel(): number {
        return this.item.itemLevel
    }

    /**The vendor price in copper, or 0 for items that cannot be sold. */
    public get sellPrice(): number {
        return this.item.sellPrice
    }

    public Use(): void {
        UseContainerItem(this.bag_id, this.slot)
    }
}