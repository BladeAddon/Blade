import { ChatCommand } from '../api/ChatCommand'
import { CommandHandler } from '../api/CommandHandler'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'
export class ActionBarSaver extends Module {
    @Inject("CommandHandler") private readonly _commandHandler!: CommandHandler

    constructor() {
        super("ActionBarSaver", "ActionBarSaver")

        this._commandHandler.RegisterCommand(new ChatCommand("saveactions", this._localization.Get("SAVE_ACTIONS_DESCRIPTION"), this.SaveProfile.bind(this)))
        this._commandHandler.RegisterCommand(new ChatCommand("loadactions", this._localization.Get("LOAD_ACTIONS_DESCRIPTION"), this.LoadProfile.bind(this)))
    }

    protected OnLoad(): void {
        return
    }

    private SaveProfile(profile: string): void {
        this._db.Set(profile, undefined)
        const db = this._db.GetConfig(profile)
        const macros = db.GetConfig("macros")
        const actions = db.GetConfig("actions")
        for (let slot = 1; slot <= 512; slot++) {
            const [actionType, id, _subType] = GetActionInfo(slot)
            if (actionType !== undefined && id !== 0) {
                this._output.Print(...GetActionInfo(slot))
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

    private FindMacro(macro: Macro): number | undefined {
        for (let index = 0; index < 999; index++) {
            const [name, _icon, body] = GetMacroInfo(index)
            if (name !== undefined) {
                if (name === macro.name && body === macro.body) {
                    return index
                }
            }
        }

        return undefined
    }

    private LoadProfile(profile: string): void {
        ClearCursor()
        const db = this._db.GetConfig(profile)
        const macros = db.GetConfig("macros")
        const actions = db.GetConfig("actions")
        for (let slot = 1; slot <= 512; slot++) {
            const [actionType, _id, _subType] = GetActionInfo(slot)
            if (actionType !== undefined) {
                PickupAction(slot)
                ClearCursor()
            }

            const action = actions.Get<Action>(slot)
            if (action) {
                if (action.type === "macro") {
                    const macro = macros.Get<Macro>(action.id)
                    if (!macro) {
                        error(`macro ${action.id} for slot ${slot} was saved doesn't exist`)
                    }

                    const [name, _icon, _body] = GetMacroInfo(action.id)
                    if (name === undefined) {
                        const macroID = this.FindMacro(macro) ?? CreateMacro(macro.name, macro.icon, macro.body, true)
                        PickupMacro(macroID)
                    } else {
                        PickupMacro(macro.id)
                    }

                    PlaceAction(slot)
                    this._output.Print(slot, action.type, action.id, macro.name)
                } else if (action.type === "spell") {
                    PickupSpell(action.id)
                    PlaceAction(slot)
                    this._output.Print(slot, action.type, action.id, C_SpellBook.GetSpellLinkFromSpellID(action.id))
                } else if (action.type === "item") {
                    PickupItem(action.id)
                    PlaceAction(slot)
                    this._output.Print(slot, action.type, action.id)
                } else if (action.type === "summonmount") {
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
                    this._output.Print(slot, action.type, action.id)
                }

                ClearCursor()
            }
        }

        this._output.Print(this._localization.Format("LOADED_PROFILE", profile))
    }
}
