import { IEventHandler } from '../../event/IEventHandler'
import { Bag } from '../../item/bag/Bag'
import { Items } from '../../item/Items'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

const TRIGGER = "!keys"

export class KeyResponder extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    private _lastKey?: string

    public constructor() {
        super("KeyResponder", "KeyResponder")
        this._menu.setDescription(this._localization.Get("KEY_RESPONDER_DESCRIPTION"))
        this._menu.AddToggle("RESPOND_KEYS_PARTY", this._localization.Get("RESPOND_KEYS_PARTY_NAME")).desc = this._localization.Get("RESPOND_KEYS_PARTY_DESCRIPTION")
        if (this._moduleSettings.Get("RESPOND_KEYS_PARTY") === undefined) {
            this._moduleSettings.Set("RESPOND_KEYS_PARTY", true)
        }
        this._menu.AddToggle("ANNOUNCE_NEW_KEYS_PARTY", this._localization.Get("ANNOUNCE_NEW_KEYS_PARTY_NAME")).desc = this._localization.Get("ANNOUNCE_NEW_KEYS_PARTY_NAME")
    }

    private LinkKey(chatType: string): void {
        for (const keystone of this._bag.FindBagItemsByID(Items.KEYSTONE_ITEM_ID)) {
            SendChatMessage(keystone.itemLink, chatType)
        }
    }

    private OnPartyMsg(text: string): void {
        if (!this.ShouldLoad() || !this._moduleSettings.Get("RESPOND_KEYS_PARTY") || text !== TRIGGER) {
            return
        }

        this.LinkKey("PARTY")
    }

    protected OnLoad(): void {
        const onPartyMsg = this.OnPartyMsg.bind(this)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY", onPartyMsg)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY_LEADER", onPartyMsg)

        this._lastKey = this._bag.FindBagItemByID(Items.KEYSTONE_ITEM_ID)?.itemLink

        this._bag.AddChangedItemEventListener((item) => {
            if (item.itemID === Items.KEYSTONE_ITEM_ID) {
                this._output.Print("changed keystone", item.itemLink)
                if (item.itemLink !== this._lastKey) {
                    this._lastKey = item.itemLink
                    this._output.Print("new keystone", item.itemLink)
                }
            }
        })
    }
}
