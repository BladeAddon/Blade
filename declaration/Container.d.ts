declare type BAG_ID = -4 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

declare const NUM_BAG_SLOTS: number
/** @noSelf **/
declare function GetContainerNumSlots(bag_id: BAG_ID): number

declare type ContainerItemInfoResult = [texture: string, itemCount: number, locked: boolean, quality: number, readable: boolean, lootable: boolean, itemLink: string, isFiltered: boolean, noValue: boolean, itemID: number, isBound: boolean]
/** @noSelf **/
declare function GetContainerItemInfo(bag_id: BAG_ID, slot: number): LuaMultiReturn<ContainerItemInfoResult>

declare type ItemInfoResult = [itemName: string, itemLink: string, itemRarity: number, itemLevel: number, itemMinLevel: number, itemType: string, itemSubType: string, ItemStackCount: number, itemEquipLoc: string, itemTexture: string, itemSellPrice: number]
/** @noSelf **/
declare function GetItemInfo(item_id: number): LuaMultiReturn<ItemInfoResult>
/** @noSelf **/
declare function UseContainerItem(bag_id: BAG_ID, slot: number): void