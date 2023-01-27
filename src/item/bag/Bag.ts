import { ChatCommand } from '../../chat/command/ChatCommand'
import { CommandHandler } from '../../chat/command/CommandHandler'
import { IEventHandler } from '../../event/IEventHandler'
import { Loadable } from '../../loadable/Loadable'
import { Inject } from '../../tstl-di/src/Inject'
import { ContainerItem } from './ContainerItem'

declare type ContainerItemFunction = (item: ContainerItem) => void
declare type ContainerItemPredicate = (item: ContainerItem) => boolean

class ItemSplitter {
    constructor(private readonly containerIndex: number, private readonly slotIndex: number, private readonly bag: Bag) { }

    public Split(): void {
        const containerItem = ContainerItem.Create(this.containerIndex, this.slotIndex)
        if (!containerItem || containerItem.stackCount <= 1) {
            return
        }

        C_Container.SplitContainerItem(this.containerIndex, this.slotIndex, 1)
        const emptySlot = this.bag.GetFirstEmptySlot()
        if (emptySlot) {
            C_Container.PickupContainerItem(emptySlot[0], emptySlot[1])
            C_Timer.After(0, this.Split.bind(this))
        }
        else {
            ClearCursor()
        }
    }
}

export class Bag extends Loadable {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler

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
                if (oldBag?.get(slotIndex)?.itemLink !== containerItem.itemLink) {
                    this.OnChangedItem(containerItem)
                }
            }
        }
    }

    private UpdateBags(): void {
        print("updating all bags")
        for (let bagIndex = 0; bagIndex <= NUM_TOTAL_EQUIPPED_BAG_SLOTS; bagIndex++) {
            this.UpdateBag(bagIndex)
        }
    }

    private SplitItemOnCursor(): void {
        const cursorItem = C_Cursor.GetCursorItem()
        if (cursorItem?.IsValid() && cursorItem.IsBagAndSlot()) {
            const [bag, slot] = cursorItem.GetBagAndSlot()
            ClearCursor()

            const splitter = new ItemSplitter(bag, slot, this)
            splitter.Split()
        }
    }

    protected OnLoad(): void {
        this.InitializeBags()

        this._commandHandler.RegisterCommand(new ChatCommand("split", "split", this.SplitItemOnCursor.bind(this)))

        this._eventHandler.RegisterEvent("BAG_UPDATE", this.UpdateBag.bind(this))
        this._eventHandler.RegisterEvent("CHALLENGE_MODE_COMPLETED", () => {
            C_Timer.After(3, this.UpdateBags.bind(this))
        })
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

    public GetFirstEmptySlot(): [bag: number, slot: number] | undefined {
        for (let bagIndex = 0; bagIndex <= NUM_TOTAL_EQUIPPED_BAG_SLOTS; bagIndex++) {
            for (let slotIndex = 1; slotIndex <= C_Container.GetContainerNumSlots(bagIndex); slotIndex++) {
                const containerItem = ContainerItem.Create(bagIndex, slotIndex)
                if (!containerItem) {
                    return [bagIndex, slotIndex]
                }
            }
        }

        return undefined
    }
}
