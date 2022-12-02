declare interface BaseTooltipData {
    type: Enum.TooltipDataType
}

declare interface SpellTooltipData extends BaseTooltipData {
    id: number
}

declare interface AuraTooltipData extends BaseTooltipData {
    id: number
}

declare type TooltipData = SpellTooltipData | AuraTooltipData

/** @noSelf **/
declare namespace TooltipDataProcessor {
    function AddTooltipPostCall(dataType: Enum.TooltipDataType, callback: (tooltip: GameTooltip, data: TooltipData) => void): void
}
