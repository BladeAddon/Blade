declare type WidgetHandler = "OnUpdate"

declare interface Frame {
    HookScript(event: WidgetHandler, handler: (...args: any[]) => void): void
    // HookScript(event: "OnUpdate", handler: (frame: Frame, elapsed: number) => void): void
    RegisterEvent(event: string)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    SetScript<T extends unknown[]>(event: string, handler: (T) => void)
    IsVisible(): boolean
    onEventAttached: boolean | undefined
}

/** @noSelf **/
declare function CreateFrame(frameType: string): Frame
/** @noSelf **/
declare function GetMoneyString(amount: number): string
declare const CovenantMissionFrame: Frame
