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
}
