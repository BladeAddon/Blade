import { IEventHandler } from '../../event/IEventHandler'
import { Loadable } from '../../loadable/Loadable'
import { Inject } from '../../tstl-di/src/Inject'
import { ContainerItem } from './ContainerItem'

declare type ContainerItemFunction = (item: ContainerItem) => void
declare type ContainerItemPredicate = (item: ContainerItem) => boolean

export class Bag extends Loadable {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    private readonly _changedItemEventListeners: Set<(item: ContainerItem) => void> = new Set()

    constructor() {
        super("Bag")
    }

    private readonly _containerLookup: LuaMap<number, LuaMap<number, ContainerItem>> = new LuaMap()

    private InitializeBags(): void {
        for (let bagIndex = 0; bagIndex <= NUM_TOTAL_EQUIPPED_BAG_SLOTS; bagIndex++) {
            const bag: LuaMap<number, ContainerItem> = new LuaMap()
            this._containerLookup.set(bagIndex, bag)

            for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
                const containerItem = ContainerItem.Create(bagIndex, slotIndex)
                if (containerItem) {
                    bag.set(slotIndex, containerItem)
                }
            }
        }
    }

    private OnChangedItem(item: ContainerItem): void {
        for (const listener of this._changedItemEventListeners) {
            listener(item)
        }
    }

    private UpdateBag(bagIndex: number): void {
        const oldBag = this._containerLookup.get(bagIndex)
        const bag: LuaMap<number, ContainerItem> = new LuaMap()
        this._containerLookup.set(bagIndex, bag)

        for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
            const containerItem = ContainerItem.Create(bagIndex, slotIndex)
            if (containerItem) {
                bag.set(slotIndex, containerItem)
                const oldSlot = oldBag?.get(slotIndex)
                if (!oldSlot || oldSlot.itemLink !== containerItem.itemLink) {
                    this.OnChangedItem(containerItem)
                }
            }
        }
    }

    protected OnLoad(): void {
        this.InitializeBags()

        this._eventHandler.RegisterEvent("BAG_UPDATE", this.UpdateBag.bind(this))
    }

    public AddChangedItemEventListener(listener: (item: ContainerItem) => void): void {
        this._changedItemEventListeners.add(listener)
    }

    public RemoveChangedItemEventListener(listener: (item: ContainerItem) => void): void {
        this._changedItemEventListeners.delete(listener)
    }

    public *IterItems() {
        for (const [_, bag] of this._containerLookup) {
            for (const [_, item] of bag) {
                yield item
            }
        }
    }

    public GetContainerItem(bagIndex: number, slotIndex: number): ContainerItem | undefined {
        return this._containerLookup.get(bagIndex)?.get(slotIndex)
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
