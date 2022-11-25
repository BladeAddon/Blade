/** @noSelf **/
declare namespace C_MountJournal {
    declare function GetNumMounts(): number
    declare function GetDisplayedMountID(displayIndex: number): number
    declare function Pickup(displayIndex: number): void
}
