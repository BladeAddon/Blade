import { IEventHandler } from '../../event/IEventHandler'
import { Bag } from '../../item/bag/Bag'
import { ContainerItem } from '../../item/bag/ContainerItem'
import { Items } from '../../item/Items'
import { Inject } from '../../tstl-di/src/Inject'
import { Module } from './Module'

const TRIGGER = "!keys"

export class KeyResponder extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler
    @Inject("Bag") private readonly _bag!: Bag

    private _lastKeyLink: string | undefined

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
        if (!this.ShouldLoad() || text !== TRIGGER) {
            return
        }

        this.LinkKey("PARTY")
    }

    private OnChangedContainerItem(item: ContainerItem): void {
        if (!this._moduleSettings.Get("ANNOUNCE_NEW_KEYS_PARTY")) {
            return
        }

        if (item.itemID !== Items.KEYSTONE_ITEM_ID) {
            return
        }

        if (item.itemLink === this._lastKeyLink) {
            return
        }

        this._lastKeyLink = item.itemLink

        this._output.Print("new keystone", item.itemLink)
    }

    protected OnLoad(): void {
        this._lastKeyLink = this._bag.FindBagItemByID(Items.KEYSTONE_ITEM_ID)?.itemLink

        const onPartyMsg = this.OnPartyMsg.bind(this)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY", onPartyMsg)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY_LEADER", onPartyMsg)

        this._bag.AddChangedItemEventListener(this.OnChangedContainerItem.bind(this))
    }
}
