declare namespace Item {
    function CreateFromItemID(itemID: number): ItemMixin
    function CreateFromItemLink(itemLink: string): ItemMixin
}

declare interface ItemMixin {
    ContinueOnItemLoad(handler: () => void): void
    GetItemID(): number
    GetItemName(): string
    GetItemIcon(): number
    GetItemLink(): string
    GetItemQuality(): Enum.ItemQuality
    IsItemDataCached(): boolean
}
