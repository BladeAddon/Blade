declare type WidgetHandler = "OnUpdate"

declare type AddonLoadedHandler = (event: "ADDON_LOADED", addOnName: string) => void
declare type GenericOnEventHandler = (event: string, ...args: unknown[]) => void
declare type OnEventHandler = AddonLoadedHandler | GenericOnEventHandler

declare interface Frame {
    HookScript(event: WidgetHandler, handler: (...args: any[]) => void): void
    // HookScript(event: "OnUpdate", handler: (frame: Frame, elapsed: number) => void): void
    RegisterEvent(event: string): void
    SetScript<T extends unknown[]>(event: string, handler: (...args: T) => void): void
    SetScript(event: "OnEvent", handler: OnEventHandler): void
    IsVisible(): boolean
    Show(): void
    Hide(): void
    onEventAttached: boolean | undefined
}

/** @noSelf **/
declare function CreateFrame(frameType: string): Frame
/** @noSelf **/
declare function GetMoneyString(amount: number): string
declare const CovenantMissionFrame: Frame
