/** @noSelf **/
declare namespace C_MountJournal {
    function GetNumMounts(): number
    function GetDisplayedMountID(displayIndex: number): number
    function Pickup(displayIndex: number): void
}
