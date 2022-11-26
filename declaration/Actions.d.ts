declare const MAX_ACCOUNT_MACROS: number
declare const MAX_CHARACTER_MACROS: number

declare type ActionType = "spell" | "item" | "macro" | "companion" | "equipmentset" | "flyout" | "summonmount"
declare type SpellType = "SPELL" | "FUTURESPELL" | "PETACTION" | "FLYOUT"
declare const BOOKTYPE_SPELL: "spell"
declare const BOOKTYPE_PROFESSION: "professions"
declare const BOOKTYPE_PET: "pet"
declare type BookType = "spell" | "professions" | "pet"

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
declare function GetNumMacros(): LuaMultiReturn<[global: number, perChar: number]>
/** @noSelf **/
declare function GetMacroInfo(name: string): LuaMultiReturn<[name: string, icon: number, body: string]>
/** @noSelf **/
declare function GetMacroInfo(macroSlot: number): LuaMultiReturn<[name: string, icon: number, body: string]>
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
declare function PickupSpellBookItem(spellName: string, bookType: BookType): void
/** @noSelf **/
declare function PickupSpellBookItem(index: number, bookType: BookType): void

/** @noSelf **/
declare function GetCursorInfo(): ActionType
/** @noSelf **/
declare function ClearCursor(): void
/** @noSelf **/
declare function PickupAction(slot: number): void
/** @noSelf **/
declare function PlaceAction(slot: number): void

/** @noSelf **/
declare function GetNumSpellTabs(): number
/** @noSelf **/
declare function GetSpellTabInfo(tabIndex: number): LuaMultiReturn<[name: string, texture: string, offset: number, numSlots: number, isGuild: boolean, offspecID: number]>
/** @noSelf **/
declare function GetSpellBookItemInfo(spellName: string, bookType: BookType): LuaMultiReturn<[spellType: SpellType, id: number]>
/** @noSelf **/
declare function GetSpellBookItemInfo(index: number, bookType: BookType): LuaMultiReturn<[spellType: SpellType, id: number]>
/** @noSelf **/
declare function GetFlyoutInfo(flyoutID: number): LuaMultiReturn<[name: string, description: string, numSlots: number, isKnown: boolean]>

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
