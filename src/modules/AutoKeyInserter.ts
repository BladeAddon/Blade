import { Bag } from '../api/Bag'
import { IEventHandler } from '../api/IEventHandler'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

const KEYSTONE_ITEM_ID = 180653

export class AutoKeyInserter extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    public constructor() {
        super("AutoKeyInserter", "Automatically insert Mythic Keystone into the Font")
    }

    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN", () => {
            if (!this.ShouldLoad()) {
                return
            }

            Bag.FindBagItemByID(KEYSTONE_ITEM_ID)?.Use()
        })
    }
}
