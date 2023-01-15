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

    private OnLootMessage(lootMessage: string): void {
        const lootPattern = string.format(LOOT_ITEM_SELF, "(.*)")
        const itemPattern = string.format(LOOT_ITEM_PUSHED_SELF, "(.*)")

        const keystonePattern = `keystone:${Items.KEYSTONE_ITEM_ID}`

        const [itemMatch] = string.match(lootMessage, lootPattern) || string.match(lootMessage, itemPattern)
        if (itemMatch) {
            const [keystoneMatch] = string.match(itemMatch, keystonePattern)
            if (keystoneMatch) {
                this._output.Print("new keystone", itemMatch, this._bag.FindBagItemByID(Items.KEYSTONE_ITEM_ID)?.itemLink)
                // this._lastKeyLink = this._bag.FindBagItemByID(Items.KEYSTONE_ITEM_ID)?.itemLink
            }
        }
    }

    protected OnLoad(): void {
        const onPartyMsg = this.OnPartyMsg.bind(this)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY", onPartyMsg)
        this._eventHandler.RegisterEvent("CHAT_MSG_PARTY_LEADER", onPartyMsg)

        this._eventHandler.RegisterEvent("CHAT_MSG_LOOT", this.OnLootMessage.bind(this))
        this._bag.AddChangedItemEventListener((item) => {
            if (item.itemID === Items.KEYSTONE_ITEM_ID) {
                this._output.Print("new keystone", item.itemLink)
            }
        })
    }
}
