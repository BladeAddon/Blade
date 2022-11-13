declare type WidgetHandler = "OnUpdate"

declare interface Frame {
    HookScript(event: WidgetHandler, handler: (frame: T, ...args: any[]) => void): void
    HookScript(event: "OnUpdate", handler: (frame: T, elapsed: number) => void): void
    RegisterEvent(event: string)
    SetScript<T extends any[]>(event: string, handler: (T) => void)
    SetScript(event: "OnEvent", handler: (frame: T, eventName: string, ...args: any[]) => void): void;
}

/** @noSelf **/
declare function CreateFrame(frameType: string): Frame