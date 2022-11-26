declare namespace C_Container {
    /** @noSelf **/
    function GetContainerNumSlots(containerIndex: number): number
    /** @noSelf **/
    function GetContainerItemInfo(containerIndex: number, slotIndex: number): ContainerItemInfo | undefined
    /** @noSelf **/
    function UseContainerItem(containerIndex: number, slotIndex: number, unitToken?: string, reagentBankOpen?: boolean): void
}
