declare type BAG_ID = -4 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

declare const NUM_BAG_SLOTS: number
declare interface ContainerItemInfo {
    iconFileID: number
    stackCount: number
    isLocked: boolean
    quality?: Enum.ItemQuality
    isReadable: boolean
    hasLoot: boolean
    hyperlink: string
    isFiltered: boolean
    hasNoValue: boolean
    itemID: number
    isBound: boolean
}

declare namespace C_Container {
    /** @noSelf **/
    declare function GetContainerNumSlots(containerIndex: number): number
    /** @noSelf **/
    declare function GetContainerItemInfo(containerIndex: number, slotIndex: number): ContainerItemInfo | undefined
    /** @noSelf **/
    declare function UseContainerItem(containerIndex: number, slotIndex: number, unitToken?: string, reagentBankOpen?: boolean = false): void
}

declare type ItemInfoResult = [itemName: string, itemLink: string, itemRarity: number, itemLevel: number, itemMinLevel: number, itemType: string, itemSubType: string, ItemStackCount: number, itemEquipLoc: string, itemTexture: number, itemSellPrice: number, classID: number, subclassID: number, bindType: number, expacID: number, setID: number, isCraftingReagent: boolean]
/** @noSelf **/
declare function GetItemInfo(item: number | string): LuaMultiReturn<ItemInfoResult>
declare type ItemInfoInstantResult = [itemID: number, itemType: string, itemSubType: string, itemEquipLoc: string, icon: number, classID: number, subclassID: number]
/** @noSelf **/
declare function GetItemInfoInstant(item: number | string): LuaMultiReturn<ItemInfoInstantResult>
