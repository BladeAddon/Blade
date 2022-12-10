export interface IEventHandler {
    RegisterEvent(event: string, handler: (...args: any[]) => void): void
}
