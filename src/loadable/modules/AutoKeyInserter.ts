import { IEventHandler } from '../../event/IEventHandler'
import { Bag } from '../../item/bag/Bag'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

const KEYSTONE_ITEM_ID = 180653

export class AutoKeyInserter extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    public constructor() {
        super("AutoKeyInserter", "Auto Key-inserter")
        this._menu.setDescription(this._localization.Get("AUTO_KEY_INSERTER_DESCRIPTION"))
    }

    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN", () => {
            if (!this.ShouldLoad()) {
                return
            }

            this._bag.FindBagItemByID(KEYSTONE_ITEM_ID)?.Use()
        })
    }
}
