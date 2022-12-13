import { IEventHandler } from '../../event/IEventHandler'
import { Loadable } from '../../loadable/Loadable'
import { Inject } from '../../tstl-di/src/Inject'
import { ContainerItem } from './ContainerItem'

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
