/** @noSelf **/
declare namespace C_Container {
    function GetContainerNumSlots(containerIndex: number): number
    function GetContainerItemInfo(containerIndex: number, slotIndex: number): ContainerItemInfo | undefined
    function UseContainerItem(containerIndex: number, slotIndex: number, unitToken?: string, reagentBankOpen?: boolean): void
    function GetContainerItemLink(containerIndex: number, slotIndex: number): string
    function SplitContainerItem(containerIndex: number, slotIndex: number, amount: number): void
    function PickupContainerItem(containerIndex: number, slotIndex: number): void
}
