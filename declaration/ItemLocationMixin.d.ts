declare namespace ItemLocation {
    declare function CreateEmpty(): ItemLocationMixin
    declare function CreateFromBagAndSlot(bagID: number, slotIndex: number): ItemLocationMixin
    declare function CreateFromEquipmentSlot(equipmentSlotIndex: number): ItemLocationMixin
}

declare interface ItemLocationMixin {
    Clear(): void
    SetBagAndSlot(bagID: number, slotIndex: number): void
    GetBagAndSlot(): LuaMultiReturn<[bagID: number, slotIndex: number]>
    IsValid(): boolean
}
