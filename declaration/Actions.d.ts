declare type ActionType = "spell" | "item" | "macro" | "companion" | "equipmentset" | "flyout" | "summonmount"

declare type ActionInfoSpell = [actionType: "spell", id: number, subType: string]
declare type ActionInfoItem = [actionType: "item", id: number, subType: string]
declare type ActionInfoMacro = [actionType: "macro", id: number, subType: string]
declare type ActionInfoCompanion = [actionType: "companion", id: number, subType: string]
declare type ActionInfoMount = [actionType: "summonmount", id: number, subType: string]
declare type ActionInfoEquipmentset = [actionType: "equipmentset", id: string, subType: string]
declare type ActionInfoFlyout = [actionType: "flyout", id: number, subType: string]
/** @noSelf **/
declare function GetActionInfo(slot: number): LuaMultiReturn<ActionInfoSpell | ActionInfoItem | ActionInfoMacro | ActionInfoCompanion | ActionInfoMount | ActionInfoEquipmentset | ActionInfoFlyout | undefined>

/** @noSelf **/
declare function GetMacroInfo(macroSlot: number): LuaMultiReturn<[name: string, icon: number, body: string]>
/** @noSelf **/
declare function GetMacroInfo(name: string): LuaMultiReturn<[name: string, icon: number, body: string]>
/** @noSelf **/
declare function EditMacro(macroSlot: number, name: string, icon?: number, body?: string): number
/** @noSelf **/
declare function CreateMacro(name: string, icon?: number, body?: string, perCharacter?: boolean): number

/** @noSelf **/
declare function PickupSpell(spellID: number): void
/** @noSelf **/
declare function PickupMacro(macroID: number): void
/** @noSelf **/
declare function PickupItem(itemID: number): void
/** @noSelf **/
declare function PickupCompanion(type: string, index: number): void

/** @noSelf **/
declare function GetCursorInfo(): ActionType
/** @noSelf **/
declare function ClearCursor(): void
/** @noSelf **/
declare function PickupAction(slot: number): void
/** @noSelf **/
declare function PlaceAction(slot: number): void

declare interface Macro {
    id: number
    name: string
    icon: number
    body: string
}

declare interface Action {
    type: ActionType
    slot: number,
    id: number
}

declare interface EquipmentsetAction extends Action {
    type: "equipmentset"
    id: string
}
