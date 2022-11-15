export class Item {
    private _itemInfo: ItemInfoResult | undefined
    constructor(public readonly itemID: number) {
    }

    public get itemInfo(): ItemInfoResult {
        return this._itemInfo ??= GetItemInfo(this.itemID)
    }

    public get itemName(): string {
        return this.itemInfo[0]
    }

    public get itemLink(): string {
        return this.itemInfo[1]
    }

    public get itemQuality(): Enum.ItemQuality {
        return this.itemInfo[2]
    }

    public get itemLevel(): number {
        return this.itemInfo[3]
    }

    public get itemMinLevel(): number {
        return this.itemInfo[4]
    }

    public get itemType(): string {
        return this.itemInfo[5]
    }

    public get itemSubType(): string {
        return this.itemInfo[6]
    }

    public get itemStackCount(): number {
        return this.itemInfo[7]
    }

    public get itemEquipLoc(): string {
        return this.itemInfo[8]
    }

    public get itemTexture(): number {
        return this.itemInfo[9]
    }

    public get sellPrice(): number {
        return this.itemInfo[10]
    }

    public get classID(): number {
        return this.itemInfo[11]
    }

    public get subclassID(): number {
        return this.itemInfo[12]
    }

    public get bindType(): number {
        return this.itemInfo[13]
    }

    public get expacID(): number {
        return this.itemInfo[14]
    }

    public get setID(): number {
        return this.itemInfo[15]
    }

    public get isCraftingReagent(): boolean {
        return this.itemInfo[16]
    }
}