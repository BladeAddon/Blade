import { ColorHelper } from '../api/ColorHelper'
import { OptionsMenu } from '../options'
import { Module } from './Module'

export class TooltipInfo extends Module {
    private readonly _spellGroup: OptionsMenu
    private readonly _auraGroup: OptionsMenu
    private readonly _itemGroup: OptionsMenu

    constructor() {
        super("TooltipInfo", "Tooltip Info")

        this._menu.setChildGroups("tab")

        this._spellGroup = this._menu.AddMenu("TooltipSpellOptions", "Spell")
        this._spellGroup.AddToggle("SHOW_SPELL_ID", "Spell ID").desc = this._localization.Get("TOOLTIP_SHOW_SPELL_ID")

        this._auraGroup = this._menu.AddMenu("TooltipAuraOptions", "Aura")
        this._auraGroup.AddToggle("SHOW_AURA_ID", "Aura ID").desc = this._localization.Get("TOOLTIP_SHOW_AURA_ID")
        this._auraGroup.AddToggle("SHOW_AURA_SOURCE", "Aura Source").desc = this._localization.Get("TOOLTIP_SHOW_AURA_SOURCE")

        this._itemGroup = this._menu.AddMenu("TooltipItemOptions", "Item")
        this._itemGroup.AddToggle("SHOW_ITEM_ID", "Item ID").desc = this._localization.Get("TOOLTIP_SHOW_ITEM_ID")
    }

    private AddColoredDoubleLine(tooltip: IGameTooltip, leftText: string, rightText: string): void {
        tooltip.AddDoubleLine(ColorHelper.Encode(leftText, ColorHelper.HIGHLIGHT_COLOR), ColorHelper.Encode(rightText, ColorHelper.WHITE))
    }

    private OnSpellTooltip(tooltip: IGameTooltip, data: SpellTooltipData): void {
        if (!this._spellGroup.IsOptionEnabled("SHOW_SPELL_ID")) {
            return
        }

        const spellID = data.id
        if (!spellID) {
            return
        }

        this.AddColoredDoubleLine(tooltip, "spellid:", spellID.toString())
    }

    private OnMacroTooltip(_tooltip: IGameTooltip, data: MacroTooltipData): void {
        print(data.id)
    }

    private OnAuraTooltip(tooltip: IGameTooltip, data: AuraTooltipData): void {
        if (!this._auraGroup.IsOptionEnabled("SHOW_AURA_ID")) {
            return
        }

        const spellID = data.id
        if (!spellID) {
            return
        }

        this.AddColoredDoubleLine(tooltip, "spellid:", spellID.toString())
    }

    private OnItemTooltip(tooltip: IGameTooltip, data: ItemTooltipData): void {
        if (!this._itemGroup.IsOptionEnabled("SHOW_ITEM_ID")) {
            return
        }

        const itemID = data.id
        if (!itemID) {
            return
        }

        this.AddColoredDoubleLine(tooltip, "itemid:", itemID.toString())
    }

    protected OnLoad(): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance = this
        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.Spell, (tooltip, data: SpellTooltipData) => {
            instance.OnSpellTooltip(tooltip, data)
        })

        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.Macro, (tooltip, data: MacroTooltipData) => {
            instance.OnMacroTooltip(tooltip, data)
        })

        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.UnitAura, (tooltip, data: AuraTooltipData) => {
            instance.OnAuraTooltip(tooltip, data)
        })

        //     hooksecurefunc(GameTooltip, "SetUnitAura", function(self, ...)
        //     print(...)
        // end)

        TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.Item, (tooltip, data: ItemTooltipData) => {
            instance.OnItemTooltip(tooltip, data)
        })
    }
}
