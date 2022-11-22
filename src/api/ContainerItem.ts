import { Item } from './Item'

export class ContainerItem {
    private constructor(public readonly containerIndex: number, public readonly slotIndex: number, containerItemInfo: ContainerItemInfo) {
        this.iconFileID = containerItemInfo.iconFileID
        this.stackCount = containerItemInfo.stackCount
        this.isLocked = containerItemInfo.isLocked
        this.quality = containerItemInfo.quality
        this.isReadable = containerItemInfo.isReadable
        this.hasLoot = containerItemInfo.hasLoot
        this.hyperlink = containerItemInfo.hyperlink
        this.isFiltered = containerItemInfo.isFiltered
        this.hasNoValue = containerItemInfo.hasNoValue
        this.itemID = containerItemInfo.itemID
        this.isBound = containerItemInfo.isBound

        const item = new Item(this.itemID)
        this.sellPrice = item.sellPrice!
    }

    public static Create(containerIndex: number, slotIndex: number): ContainerItem | undefined {
        const containerItemInfo = C_Container.GetContainerItemInfo(containerIndex, slotIndex)
        if (containerItemInfo) {
            return new ContainerItem(containerIndex, slotIndex, containerItemInfo)
        }

        return undefined
    }

    public readonly iconFileID: number
    public readonly stackCount: number
    public readonly isLocked: boolean
    public readonly quality?: Enum.ItemQuality
    public readonly isReadable: boolean
    public readonly hasLoot: boolean
    public readonly hyperlink: string
    public readonly isFiltered: boolean
    public readonly hasNoValue: boolean
    public readonly itemID: number
    public readonly isBound: boolean
    public readonly sellPrice: number
    public Use(): void {
        C_Container.UseContainerItem(this.containerIndex, this.slotIndex)
    }
}
