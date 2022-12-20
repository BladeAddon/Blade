import { Loadable } from '../../loadable/Loadable'
import { ContainerItem } from './ContainerItem'

declare type ContainerItemFunction = (item: ContainerItem) => void
declare type ContainerItemPredicate = (item: ContainerItem) => boolean

export class Bag extends Loadable {
    constructor() {
        super("Bag")
    }

    protected OnLoad(): void {
        return
    }

    public *IterItems() {
        for (let bagIndex = 0; bagIndex <= NUM_BAG_SLOTS; bagIndex++) {
            for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
                const containerItem = ContainerItem.Create(bagIndex, slotIndex)
                if (containerItem) {
                    yield containerItem
                }
            }
        }
    }

    public FindBagItemByID(itemID: number): ContainerItem | undefined {
        for (const item of this.IterItems()) {
            if (item.itemID === itemID) {
                return item
            }
        }

        return undefined
    }

    public *FindBagItemsByID(itemID: number) {
        for (const item of this.IterItems()) {
            if (item.itemID === itemID) {
                yield item
            }
        }
    }

    public FindItem(predicate: ContainerItemPredicate): ContainerItem | undefined {
        for (const item of this.IterItems()) {
            if (predicate(item)) {
                return item
            }
        }

        return undefined
    }

    public FindItems(predicate: ContainerItemPredicate): ContainerItem[] {
        const items = []
        for (const item of this.IterItems()) {
            if (predicate(item)) {
                items.push(item)
            }
        }

        return items
    }

    public *SelectItems(predicate: ContainerItemPredicate) {
        for (const item of this.IterItems()) {
            if (predicate(item)) {
                yield item
            }
        }
    }

    public CallOnItems(f: ContainerItemFunction): void {
        for (const item of this.IterItems()) {
            f(item)
        }
    }
}
