import { ContainerItem } from './ContainerItem'
import { Loadable } from '../Loadable'
import { Inject } from '../tstl-di/src/Inject'
import { IEventHandler } from './IEventHandler'

declare type ContainerItemFunction = (item: ContainerItem) => void
declare type ContainerItemPredicate = (item: ContainerItem) => boolean

export class Bag extends Loadable {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    constructor() {
        super("Bag")
    }

    private readonly _containerLookup: LuaMap<number, LuaMap<number, ContainerItem>> = new LuaMap()

    private UpdateBags(): void {
        for (let bagIndex = 0; bagIndex <= NUM_BAG_SLOTS; bagIndex++) {
            this.UpdateBag(bagIndex)
        }
    }

    private UpdateBag(bagIndex: number): void {
        const bag: LuaMap<number, ContainerItem> = new LuaMap()
        this._containerLookup.set(bagIndex, bag)

        for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
            const containerItem = ContainerItem.Create(bagIndex, slotIndex)
            if (containerItem) {
                bag.set(slotIndex, containerItem)
            }
        }
    }

    protected OnLoad(): void {
        this.UpdateBags()
        this._eventHandler.RegisterEvent("BAG_UPDATE", this.UpdateBag.bind(this))
    }

    public static *IterItems() {
        for (let bagIndex = 0; bagIndex <= NUM_BAG_SLOTS; bagIndex++) {
            for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
                const containerItem = ContainerItem.Create(bagIndex, slotIndex)
                if (containerItem) {
                    yield containerItem
                }
            }
        }
    }

    public GetContainerItem(bagIndex: number, slotIndex: number): ContainerItem | undefined {
        return this._containerLookup.get(bagIndex)?.get(slotIndex)
    }

    public FindBagItemByID(itemID: number): ContainerItem | undefined {
        for (const [_, bag] of this._containerLookup) {
            for (const [_, item] of bag) {
                if (item.itemID === itemID) {
                    return item
                }
            }
        }

        return undefined
    }

    public FindItem(predicate: ContainerItemPredicate): ContainerItem | undefined {
        for (const [_, bag] of this._containerLookup) {
            for (const [_, item] of bag) {
                if (predicate(item)) {
                    return item
                }
            }
        }

        return undefined
    }

    public FindItems(predicate: ContainerItemPredicate): ContainerItem[] {
        const items = []
        for (const [_, bag] of this._containerLookup) {
            for (const [_, item] of bag) {
                if (predicate(item)) {
                    items.push(item)
                }
            }
        }

        return items
    }

    public CallOnItems(f: ContainerItemFunction): void {
        for (const [_, bag] of this._containerLookup) {
            for (const [_, item] of bag) {
                f(item)
            }
        }
    }
}
