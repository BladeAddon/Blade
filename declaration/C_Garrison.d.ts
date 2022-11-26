declare interface Mission {
    missionID: number
}

/** @noSelf **/
declare namespace C_Garrison {
    function GetCompleteMissions(followerTypeID: number): Mission[]
    function RegenerateCombatLog(missionID: number): void
    function MarkMissionComplete(missionID: number): void
    function MissionBonusRoll(missionID: number): void
}

declare const GarrisonFollowerOptions: LuaTable<number, Frame>
