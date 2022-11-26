/** @noSelf **/
declare namespace C_Item {
    function GetItemID(itemLocation: ItemLocationMixin): number
    function GetItemQuality(itemLocation: ItemLocationMixin): Enum.ItemQuality
    function DoesItemExistByID(itemID: number): boolean
    function DoesItemExist(emptiableItemLocation: ItemLocationMixin): boolean
}
