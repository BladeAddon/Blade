declare const MerchantFrame: Frame
/** @noSelf **/
declare function CanMerchantRepair(): boolean

/** @noSelf **/
declare function GetRepairAllCost(): LuaMultiReturn<[repairAllCost: number, canRepair: boolean]>
/** @noSelf **/
declare function RepairAllItems(guildBankRepair?: boolean): void
