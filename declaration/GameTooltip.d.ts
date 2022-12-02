declare interface GameTooltip extends Frame {
    AddDoubleLine(leftText: string, rightText: string): void
    GetSpell(): LuaMultiReturn<[spellName: string, spellID: number] | undefined[]>
    GetUnit(): LuaMultiReturn<[unitName: string, unitID: string] | undefined[]>
}
