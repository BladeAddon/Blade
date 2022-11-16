declare type WidgetHandler = "OnUpdate"

declare interface Frame {
    HookScript(event: WidgetHandler, handler: (frame: Frame, ...args: any[]) => void): void
    HookScript(event: "OnUpdate", handler: (frame: Frame, elapsed: number) => void): void
    RegisterEvent(event: string)
    SetScript<T extends any[]>(event: string, handler: (T) => void)
    SetScript(event: "OnEvent", handler: (frame: Frame, eventName: string, ...args: any[]) => void): void
    IsVisible(): boolean
    onEventAttached: boolean | undefined
}

/** @noSelf **/
declare function CreateFrame(frameType: string): Frame
/** @noSelf **/
declare function GetMoneyString(amount: number): string
declare const CovenantMissionFrame: Frame