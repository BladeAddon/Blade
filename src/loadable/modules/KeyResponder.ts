import { IEventHandler } from '../../event/IEventHandler'
import { Bag } from '../../item/bag/Bag'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

const KEYSTONE_ITEM_ID = 180653
const TRIGGER = "!keys"

export class KeyResponder extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    public constructor() {
        super("KeyResponder", "KeyResponder")
        this._menu.setDescription(this._localization.Get("KEY_RESPONDER_DESCRIPTION"))
    }

    private LinkKey(chatType: string): void {
        const keystone = this._bag.FindBagItemByID(KEYSTONE_ITEM_ID)
        if (keystone) {
            SendChatMessage(keystone.itemLink, chatType)
        }
    }

    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY", (text: string, _playerName: string) => {
            if (!this.ShouldLoad()) {
                return
            }

            if (text !== TRIGGER) {
                return
            }

            this.LinkKey("PARTY")
        })

        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY_LEADER", (text: string, _playerName: string) => {
            if (!this.ShouldLoad()) {
                return
            }

            if (text !== TRIGGER) {
                return
            }

            this.LinkKey("PARTY")
        })
    }
}
