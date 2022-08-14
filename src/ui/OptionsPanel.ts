import { FrameInterfaceCategory } from '@wartoshika/wow-declarations'
import { AddonInfo } from '../AddonInfo'

export class OptionsPanel {
    private static s_instance: OptionsPanel | undefined

    public static get instance(): OptionsPanel {
        if (!OptionsPanel.s_instance) {
            OptionsPanel.s_instance = new OptionsPanel()
        }

        return OptionsPanel.s_instance
    }

    private readonly _optionsPanel: FrameInterfaceCategory

    public constructor() {
        this._optionsPanel = CreateFrame('Frame', `${AddonInfo.addonName}OptionsPanel`) as FrameInterfaceCategory
        this._optionsPanel.name = AddonInfo.addonName
    }
}
