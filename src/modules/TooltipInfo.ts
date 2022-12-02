import { ColorHelper } from '../api/ColorHelper'
import { Module } from './Module'

export class TooltipInfo extends Module {
    constructor() {
        super("TooltipInfo", "Tooltip Info")

        this._menu.AddToggle("SHOW_SPELL_ID", "Show Spell ID").desc = this._localization.Get("TOOLTIP_SHOW_SPELL_ID")
        this._menu.AddToggle("SHOW_AURA_ID", "Show Aura ID").desc = this._localization.Get("TOOLTIP_SHOW_AURA_ID")
    }

    private AddColoredDoubleLine(tooltip: GameTooltip, leftText: string, rightText: string): void {
        tooltip.AddDoubleLine(ColorHelper.Encode(leftText, ColorHelper.HIGHLIGHT_COLOR), ColorHelper.Encode(rightText, ColorHelper.WHITE))
    }

    private OnSpellTooltip(tooltip: GameTooltip, data: SpellTooltipData): void {
        if (!this.IsOptionEnabled("SHOW_SPELL_ID")) {
            return
        }

        const spellID = data.id
        if (!spellID) {
            return
        }

        this.AddColoredDoubleLine(tooltip, "spellid:", spellID.toString())
    }

    private OnAuraTooltip(tooltip: GameTooltip, data: AuraTooltipData): void {
        if (!this.IsOptionEnabled("SHOW_AURA_ID")) {
            return
        }

        const spellID = data.id
        if (!spellID) {
            return
        }

        this.AddColoredDoubleLine(tooltip, "spellid:", spellID.toString())
    }

    protected OnLoad(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance = this
        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.Spell, (tooltip, data: TooltipData) => {
            instance.OnSpellTooltip(tooltip, data)
        })

        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.UnitAura, (tooltip, data: TooltipData) => {
            instance.OnAuraTooltip(tooltip, data)
        })
    }
}
