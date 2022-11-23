declare interface Mission {
    missionID: number
}

/** @noSelf **/
declare namespace C_Garrison {
    declare function GetCompleteMissions(followerTypeID: number): Mission[]
    declare function RegenerateCombatLog(missionID: number): void
    declare function MarkMissionComplete(missionID: number): void
    declare function MissionBonusRoll(missionID: number): void
}

declare const GarrisonFollowerOptions: LuaTable<number, Frame>
