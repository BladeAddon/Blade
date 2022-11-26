declare namespace ItemLocation {
    function CreateEmpty(): ItemLocationMixin
    function CreateFromBagAndSlot(bagID: number, slotIndex: number): ItemLocationMixin
    function CreateFromEquipmentSlot(equipmentSlotIndex: number): ItemLocationMixin
}

declare interface ItemLocationMixin {
    Clear(): void
    SetBagAndSlot(bagID: number, slotIndex: number): void
    GetBagAndSlot(): LuaMultiReturn<[bagID: number, slotIndex: number]>
    IsValid(): boolean
}
