declare namespace C_Container {
    /** @noSelf **/
    declare function GetContainerNumSlots(containerIndex: number): number
    /** @noSelf **/
    declare function GetContainerItemInfo(containerIndex: number, slotIndex: number): ContainerItemInfo | undefined
    /** @noSelf **/
    declare function UseContainerItem(containerIndex: number, slotIndex: number, unitToken?: string, reagentBankOpen?: boolean = false): void
}
