declare type Faction = "Alliance" | "Horde" | "Neutral"

/** @noSelf **/
declare function UnitFactionGroup(unit:string): Faction | undefined
