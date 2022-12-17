import { IEventHandler } from '../../event/IEventHandler'
import { Bag } from '../../item/bag/Bag'
import { Items } from '../../item/Items'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

const TRIGGER = "!keys"

export class KeyResponder extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    public constructor() {
        super("KeyResponder", "KeyResponder")
        this._menu.setDescription(this._localization.Get("KEY_RESPONDER_DESCRIPTION"))
    }

    private LinkKey(chatType: string): void {
        for (const keystone of this._bag.FindBagItemsByID(Items.KEYSTONE_ITEM_ID)) {
            SendChatMessage(keystone.itemLink, chatType)
        }
    }

    private OnPartyMsg(text: string): void {
        if (!this.ShouldLoad() || text !== TRIGGER) {
            return
        }

        this.LinkKey("PARTY")
    }

    protected OnLoad(): void {
        const onPartyMsg = this.OnPartyMsg.bind(this)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY", onPartyMsg)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY_LEADER", onPartyMsg)
    }
}
