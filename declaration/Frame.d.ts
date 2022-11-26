declare type WidgetHandler = "OnUpdate"

declare interface Frame {
    HookScript(event: WidgetHandler, handler: (...args: any[]) => void): void
    // HookScript(event: "OnUpdate", handler: (frame: Frame, elapsed: number) => void): void
    RegisterEvent(event: string): void
    SetScript<T extends unknown[]>(event: string, handler: (...args: T) => void): void
    IsVisible(): boolean
    onEventAttached: boolean | undefined
}

/** @noSelf **/
declare function CreateFrame(frameType: string): Frame
/** @noSelf **/
declare function GetMoneyString(amount: number): string
declare const CovenantMissionFrame: Frame
