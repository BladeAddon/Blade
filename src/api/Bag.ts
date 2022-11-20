import { ContainerItem } from './ContainerItem'

class ContainerItemIterator implements Iterable<ContainerItem> {
    [Symbol.iterator](): Iterator<ContainerItem> {
        let bag = 0
        let bagMax = NUM_BAG_SLOTS
        let slot = 1
        let slotMax = C_Container.GetContainerNumSlots(bag)
        return {
            next: () => {
                if (slot > slotMax) {
                    slot = 1
                    bag++
                    if (bag > bagMax) {
                        return {
                            value: undefined,
                            done: true
                        }
                    } else {
                        slotMax = C_Container.GetContainerNumSlots(bag)
                    }
                }

                let item = new ContainerItem(bag, slot)
                slot++
                return {
                    value: item
                }
            }
        }
    }
}

class ContainerItemPredicateIterator implements Iterable<ContainerItem> {
    constructor(private readonly predicate: (item: ContainerItem) => boolean) { }
    [Symbol.iterator](): Iterator<ContainerItem, any, undefined> {
        const containerItemIterator = new ContainerItemIterator()
        const iter = containerItemIterator[Symbol.iterator]()

        return {
            next: () => {
                let v
                while (!(v = iter.next()).done) {
                    if (this.predicate(v.value)) {
                        return {
                            value: v.value
                        }
                    }
                }

                return {
                    value: undefined,
                    done: true
                }
            }
        }
    }
}

export class Bag {
    public static GetContainerItems(): Iterable<ContainerItem> {
        return new ContainerItemIterator()
    }

    public static FindBagItemByID(itemID: number): ContainerItem | undefined {
        for (const containerItem of this.GetContainerItems()) {
            if (containerItem.itemID === itemID) {
                return containerItem
            }
        }

        return undefined
    }

    public static FindItem(predicate: (item: ContainerItem) => boolean): ContainerItem | undefined {
        for (const containerItem of this.GetContainerItems()) {
            if (predicate(containerItem)) {
                return containerItem
            }
        }

        return undefined
    }

    public static FindItems(predicate: (item: ContainerItem) => boolean): Iterable<ContainerItem> {
        return new ContainerItemPredicateIterator(predicate)
    }
}
