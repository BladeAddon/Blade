import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { Macros } from '../api/Macros'
import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

class ActionBarLoader {
    private readonly _macros: ConfigService
    private readonly _actions: ConfigService

    constructor(private readonly _db: ConfigService) {
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

    private LoadMacro(slot: number, action: Action): void {
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

    private LoadMount(slot: number, action: Action): void {
        // random favorite
        if (action.id === 268435455) {
            C_MountJournal.Pickup(0)
        } else {
            // find displayIndex
            for (let index = 1; index <= C_MountJournal.GetNumMounts(); index++) {
                if (C_MountJournal.GetDisplayedMountID(index) === action.id) {
                    C_MountJournal.Pickup(index)
                    break
                }
            }
        }

        PlaceAction(slot)
    }

    private LoadFlyout(slot: number, action: Action): void {
        const spellbookItem = this.FindSpellBook(action.id)
        if (spellbookItem) {
            PickupSpellBookItem(spellbookItem.index, spellbookItem.bookType)
            PlaceAction(slot)
        }
    }

    private LoadAction(slot: number, action: Action): void {
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
                break
        }

        ClearCursor()
    }

    public Execute(): void {
        ClearCursor()

        for (let slot = 1; slot <= 512; slot++) {
            this.ClearActionSlot(slot)

            const action = this._actions.Get<Action>(slot)
            if (action) {
                this.LoadAction(slot, action)
            }
        }
    }
}

export class ActionBarSaver extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler

    constructor() {
        super("ActionBarSaver", "ActionBarSaver")
    }

    protected OnLoad(): void {
        this._commandHandler.RegisterCommand(new ChatCommand("saveactions", this._localization.Get("SAVE_ACTIONS_DESCRIPTION"), this.SaveProfile.bind(this)))
        this._commandHandler.RegisterCommand(new ChatCommand("loadactions", this._localization.Get("LOAD_ACTIONS_DESCRIPTION"), this.LoadProfile.bind(this)))
    }

    private SaveProfile(profile: string): void {
        this._db.Set(profile, undefined)
        const db = this._db.GetConfig(profile)
        const macros = db.GetConfig("macros")
        const actions = db.GetConfig("actions")
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
                    macros.Set(id, macro)
                }

                if (actionType === "equipmentset") {
                    const action: EquipmentsetAction = {
                        slot: slot,
                        id: id,
                        type: actionType
                    }

                    actions.Set(slot, action)
                } else {
                    const action: Action = {
                        slot: slot,
                        id: id,
                        type: actionType
                    }

                    actions.Set(slot, action)
                }
            }
        }

        this._output.Print(this._localization.Format("SAVED_PROFILE", profile))
    }

    private LoadProfile(profile: string): void {
        const db = this._db.GetConfig(profile)
        new ActionBarLoader(db).Execute()
        this._output.Print(this._localization.Format("LOADED_PROFILE", profile))
    }
}
