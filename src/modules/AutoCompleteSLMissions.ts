import { IEventHandler } from '../api/IEventHandler'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

const retryTime = 0.5

export class AutoCompleteSLMissions extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    private readonly _blackList: LuaTable<number> = new LuaTable()

    private _hooked = false

    constructor() {
        super("AutoCompleteSLMissions", "Automatically completes missions from mission table")
    }

    private CovenantMissionFrame_OnUpdate(followerTypeID: number): void {
        if (!this.ShouldLoad()) {
            return
        }

        for (const [id, time] of this._blackList) {
            if (GetTime() - time > retryTime) {
                this._blackList.set(id, undefined)
            }
        }

        if (CovenantMissionFrame.IsVisible()) {
            const completeMissions = C_Garrison.GetCompleteMissions(followerTypeID)
            for (const mission of completeMissions) {
                const missionID = mission.missionID
                if (!this._blackList.has(missionID)) {
                    C_Garrison.RegenerateCombatLog(missionID)
                    C_Garrison.MarkMissionComplete(missionID)
                    C_Garrison.MissionBonusRoll(missionID)
                    this._blackList.set(missionID, GetTime())
                }
            }
        }
    }

    private On_GARRISON_MISSION_NPC_OPENED(followerTypeID: number): void {
        if (this._hooked) {
            return
        }

        CovenantMissionFrame.HookScript("OnUpdate", this.CovenantMissionFrame_OnUpdate.bind(this, followerTypeID))

        this._hooked = true
    }

    protected OnLoad(): void {
        this._eventHandler.RegisterEvent("GARRISON_MISSION_NPC_OPENED", this.On_GARRISON_MISSION_NPC_OPENED.bind(this))
    }
}