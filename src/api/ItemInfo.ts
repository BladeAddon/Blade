export class ItemInfo {
    private _itemInfo: ItemInfoResult | undefined
    private _itemInfoInstant: ItemInfoInstantResult | undefined

    constructor(public readonly item: number | string) {
    }

    public get itemInfo(): ItemInfoResult | undefined {
        return this._itemInfo ??= GetItemInfo(this.item)
    }

    public get itemInfoInstant(): ItemInfoInstantResult | undefined {
        return this._itemInfoInstant ??= GetItemInfoInstant(this.item)
    }

    public get itemName(): string | undefined {
        return this.itemInfo?.[0]
    }

    public get itemLink(): string | undefined {
        return this.itemInfo?.[1]
    }

    public get itemQuality(): Enum.ItemQuality | undefined {
        return this.itemInfo?.[2]
    }

    public get itemLevel(): number | undefined {
        return this.itemInfo?.[3]
    }

    public get itemMinLevel(): number | undefined {
        return this.itemInfo?.[4]
    }

    public get itemType(): string | undefined {
        return this.itemInfo?.[5]
    }

    public get itemSubType(): string | undefined {
        return this.itemInfo?.[6]
    }

    public get itemStackCount(): number | undefined {
        return this.itemInfo?.[7]
    }

    public get itemEquipLoc(): string | undefined {
        return this.itemInfo?.[8]
    }

    public get itemTexture(): number | undefined {
        return this.itemInfo?.[9]
    }

    public get sellPrice(): number | undefined {
        return this.itemInfo?.[10]
    }

    public get classID(): number | undefined {
        return this.itemInfo?.[11]
    }

    public get subclassID(): number | undefined {
        return this.itemInfo?.[12]
    }

    public get bindType(): number | undefined {
        return this.itemInfo?.[13]
    }

    public get expacID(): number | undefined {
        return this.itemInfo?.[14]
    }

    public get setID(): number | undefined {
        return this.itemInfo?.[15]
    }

    public get isCraftingReagent(): boolean | undefined {
        return this.itemInfo?.[16]
    }

    public get itemID(): number | undefined {
        return this.itemInfoInstant?.[0]
    }

    public get icon(): number | undefined {
        return this.itemInfoInstant?.[4]
    }
}
