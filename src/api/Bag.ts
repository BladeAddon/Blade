import { ContainerItem } from './ContainerItem'

export class Bag {

    public static *GetContainerItems() {
        for (let bag = 0; bag < NUM_BAG_SLOTS; bag++) {
            for (let slot = 1; slot < GetContainerNumSlots(bag as BAG_ID); slot++) {
                yield new ContainerItem(bag as BAG_ID, slot)
            }
        }
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
