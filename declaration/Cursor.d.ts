
declare type CursorInfoItem = LuaMultiReturn<[cursorType: "item", itemID: number, itemLink: string]>
declare type CursorInfoSpell = LuaMultiReturn<[cursorType: "spell", spellIndex: number, bookType: typeof BOOKTYPE_SPELL, spellID: number]>
declare type CursorInfoPetAction = LuaMultiReturn<[cursorType: "petaction", spellID: number, spellIndex: number]>
declare type CursorInfoMacro = LuaMultiReturn<[cursorType: "macro", macro: number]>
declare type CursorInfoMoney = LuaMultiReturn<[cursorType: "money", amount: number]>
declare type CursorInfoMount = LuaMultiReturn<[cursorType: "mount", displayIndex: number]>
declare type CursorInfoMerchant = LuaMultiReturn<[cursorType: "merchant", index: number]>
declare type CursorInfoBattlePet = LuaMultiReturn<[cursorType: "battlepet", petGUID: string]>

declare type CursorInfo = CursorInfoItem | CursorInfoSpell | CursorInfoPetAction | CursorInfoMacro | CursorInfoMoney | CursorInfoMount | CursorInfoMerchant | CursorInfoBattlePet | undefined

/** @noSelf **/
declare function GetCursorInfo(): CursorInfo
/** @noSelf **/
declare function ClearCursor(): void
