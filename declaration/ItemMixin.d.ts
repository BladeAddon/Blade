declare namespace Item {
    function CreateFromItemID(itemID: number): ItemMixin
}

declare interface ItemMixin {
    ContinueOnItemLoad(handler: () => void): void
    GetItemName(): string
}
