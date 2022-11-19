import { IEventHandler } from '../api/IEventHandler'
import { Inject } from '../tstl-di/src/Inject'
import { Module } from './Module'

const retryTime = 0.5
const waitTime = 2

export class AutoCompleteSLMissions extends Module {
    @Inject("IEventHandler") private readonly _eventHandler!: IEventHandler

    private readonly _ignoreList: LuaTable<number> = new LuaTable()

    private _hooked = false

    private _timeSinceLastMissionFrameUpdate: number = 0
    private _waitingForWork = false

    constructor() {
        super("AutoCompleteSLMissions", "Automatically completes missions from mission table")
    }

    private EvaluateIgnoreListTimeout() {
        for (const [id, time] of this._ignoreList) {
            if (GetTime() - time > retryTime) {
                this._ignoreList.set(id, undefined)
            }
        }
    }

    private CovenantMissionFrame_OnUpdate(followerTypeID: number, elapsed: number): void {
        if (!this.ShouldLoad()) {
            return
        }

        this._timeSinceLastMissionFrameUpdate = this._timeSinceLastMissionFrameUpdate + elapsed

        if (this._timeSinceLastMissionFrameUpdate > waitTime || !this._waitingForWork) {
            this._timeSinceLastMissionFrameUpdate = this._timeSinceLastMissionFrameUpdate - waitTime

            this.EvaluateIgnoreListTimeout()

            if (CovenantMissionFrame.IsVisible()) {
                const completeMissions = C_Garrison.GetCompleteMissions(followerTypeID)
                if (completeMissions.length == 0) {
                    this._waitingForWork = true
                    return
                }
                this._waitingForWork = false

                for (const mission of completeMissions) {
                    const missionID = mission.missionID
                    if (!this._ignoreList.has(missionID)) {
                        C_Garrison.RegenerateCombatLog(missionID)
                        C_Garrison.MarkMissionComplete(missionID)
                        C_Garrison.MissionBonusRoll(missionID)
                        this._ignoreList.set(missionID, GetTime())
                    }
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