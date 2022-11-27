import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { IOutput } from '../api/IOutput'
import { Macros } from '../api/Macros'
import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'
import { Items } from '../api/Items'

class ActionBarLoader {
    @Inject("IOutput") protected readonly _output!: IOutput
    @Inject("Items") protected readonly _items!: Items

    private readonly _macros: ConfigService
    private readonly _actions: ConfigService

    constructor(private readonly profile: string, private readonly _db: ConfigService) {
        this._macros = this._db.GetConfig("macros")
        this._actions = this._db.GetConfig("actions")
    }

    private ClearActionSlot(slot: number): void {
        const [actionType, _id, _subType] = GetActionInfo(slot)
        if (actionType !== undefined) {
            PickupAction(slot)
            ClearCursor()
        }
    }

    private FindMacro(macroToFind: Macro): number | undefined {
        for (const macro of Macros.IterMacros()) {
            if (macro.name === macroToFind.name && macro.body === macroToFind.body) {
                return macro.id
            }
        }

        return undefined
    }

    private FindSpellBook(id: number): { index: number, bookType: BookType } | undefined {
        for (let spellTab = 1; spellTab <= GetNumSpellTabs(); spellTab++) {
            const [_name, _texture, offset, numSlots, _isGuild, _offspecID] = GetSpellTabInfo(spellTab)
            for (let index = offset + 1; index <= offset + numSlots; index++) {
                const [_spellType, spellBookItemID] = GetSpellBookItemInfo(index, BOOKTYPE_SPELL)
                if (id === spellBookItemID) {
                    return {
                        index: index,
                        bookType: BOOKTYPE_SPELL
                    }
                }
            }
        }

        return undefined
    }

    private LoadMacro(slot: number, action: MacroAction): void {
        const macro = this._macros.Get<Macro>(action.id)
        if (!macro) {
            error(`macro ${action.id} for slot ${slot} was saved doesn't exist`)
        }

        const [name, icon, body] = GetMacroInfo(action.id)
        if (name === macro.name && icon === macro.icon && body == macro.body) {
            PickupMacro(macro.id)
        } else {
            const macroID = this.FindMacro(macro) ?? CreateMacro(macro.name, macro.icon, macro.body, true)
            PickupMacro(macroID)
        }

        PlaceAction(slot)
    }

    private LoadMount(slot: number, action: MountAction): void {
        // random favorite
        if (action.id === 268435455) {
            C_MountJournal.Pickup(0)
            PlaceAction(slot)
            return
        }

        // find displayIndex
        for (let index = 1; index <= C_MountJournal.GetNumMounts(); index++) {
            if (C_MountJournal.GetDisplayedMountID(index) === action.id) {
                C_MountJournal.Pickup(index)
                PlaceAction(slot)
                return
            }
        }

        error(`Failed to find mount with id ${action.id}`)
    }

    private LoadFlyout(slot: number, action: FlyoutAction): void {
        const spellbookItem = this.FindSpellBook(action.id)
        if (spellbookItem) {
            PickupSpellBookItem(spellbookItem.index, spellbookItem.bookType)
            PlaceAction(slot)
        } else {
            error(`Failed to find flyout with id ${action.id}`)
        }
    }

    private LoadAction(slot: number, action: AnyAction): void {
        switch (action.type) {
            case "macro":
                this.LoadMacro(slot, action)
                break
            case "spell":
                PickupSpell(action.id)
                PlaceAction(slot)
                break
            case "item":
                PickupItem(action.id)
                PlaceAction(slot)
                break
            case "summonmount":
                this.LoadMount(slot, action)
                break
            case "flyout":
                this.LoadFlyout(slot, action)
                break
            default:
                error(`ActionType: '${action.type}' not supported`)
                break
        }

        ClearCursor()
    }

    private LoadActions(): void {
        ClearCursor()

        for (let slot = 1; slot <= 512; slot++) {
            this.ClearActionSlot(slot)

            const action = this._actions.Get<AnyAction>(slot)
            if (action) {
                this.LoadAction(slot, action)
            }
        }

        this._output.LocalizedPrint("LOADED_PROFILE", this.profile)
    }

    public Execute(): void {
        const itemIds = []
        for (let slot = 1; slot <= 512; slot++) {
            this.ClearActionSlot(slot)

            const action = this._actions.Get<AnyAction>(slot)
            if (action?.type === "item") {
                itemIds.push(action.id)
            }
        }

        if (itemIds.length > 0) {
            // we have some items in the actions and maybe need to wait for them to be loaded
            this._output.LocalizedPrint("WAIT_ITEM_CACHE")
            this._items.LoadItems(itemIds, () => {
                this._output.LocalizedPrint("LOADED_ITEM_CACHE")
                this.LoadActions()
            })

            return
        }

        this.LoadActions()
    }
}

export class ActionBarSaver extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler
    protected readonly _profileDb: ConfigService

    constructor() {
        super("ActionBarSaver", "ActionBarSaver")

        this._profileDb = this._db.GetConfig("profiles")
    }

    protected OnLoad(): void {
        this._commandHandler.RegisterCommand(new ChatCommand("saveactions", this._localization.Get("SAVE_ACTIONS_DESCRIPTION"), this.SaveProfile.bind(this)))
        this._commandHandler.RegisterCommand(new ChatCommand("loadactions", this._localization.Get("LOAD_ACTIONS_DESCRIPTION"), this.LoadProfile.bind(this)))
        this._commandHandler.RegisterCommand(new ChatCommand("deleteactions", this._localization.Get("DELETE_ACTIONS_DESCRIPTION"), this.DeleteProfile.bind(this)))
    }

    private SaveProfile(profile: string): void {
        const macros = new LuaTable()
        const actions = new LuaTable()
        for (let slot = 1; slot <= 512; slot++) {
            const [actionType, id, _subType] = GetActionInfo(slot)
            if (actionType !== undefined && id !== 0) {
                if (actionType === "macro") {
                    const [name, icon, body] = GetMacroInfo(id)
                    const macro: Macro = {
                        id: id,
                        name: name,
                        body: body,
                        icon: icon
                    }
                    macros.set(id, macro)
                }

                if (actionType === "equipmentset") {
                    const action: EquipmentsetAction = {
                        slot: slot,
                        id: id,
                        type: actionType
                    }

                    actions.set(slot, action)
                } else {
                    const action: Action = {
                        slot: slot,
                        id: id,
                        type: actionType
                    }

                    actions.set(slot, action)
                }
            }
        }

        const profileDb = new LuaTable()
        profileDb.set("macros", macros)
        profileDb.set("actions", actions)
        this._profileDb.Set(profile, profileDb)

        this._output.LocalizedPrint("SAVED_PROFILE", profile)
    }

    private LoadProfile(profile: string): void {
        if (!this._profileDb.Get(profile)) {
            this._output.LocalizedPrint("PROFILE_DOES_NOT_EXIST", profile)
            return
        }

        const db = this._profileDb.GetConfig(profile)
        new ActionBarLoader(profile, db).Execute()
    }

    private DeleteProfile(profile: string): void {
        if (!this._profileDb.Get(profile)) {
            this._output.LocalizedPrint("PROFILE_DOES_NOT_EXIST", profile)
            return
        }

        this._profileDb.Set(profile, undefined)
        this._output.LocalizedPrint("DELETED_PROFILE", profile)
    }
}
