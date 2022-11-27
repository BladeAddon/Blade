/** @noSelf **/
declare namespace C_Item {
    function GetItemID(itemLocation: ItemLocationMixin): number
    function GetItemQuality(itemLocation: ItemLocationMixin): Enum.ItemQuality
    function GetItemName(itemLocation: ItemLocationMixin): Enum.ItemQuality
    function GetItemNameByID(itemID: number): string
    function GetItemIcon(itemLocation: ItemLocationMixin): Enum.ItemQuality
    function GetItemIconByID(itemID: number): number
    function DoesItemExistByID(itemID: number): boolean
    function DoesItemExist(emptiableItemLocation: ItemLocationMixin): boolean
}
