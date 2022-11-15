import { IEventHandler } from './IEventHandler'

export class EventHandler implements IEventHandler {
    private readonly _eventHandlers: LuaMap<string, Array<(...args: any[]) => void>> = new LuaMap()
    private _frame: Frame | undefined

    private createFrame(): Frame {
        return CreateFrame('Frame')
    }

    // make sure we actually only create the frame and subscribe to events / set scripts when its really needed
    private get frame(): Frame {
        return this._frame ??= this.createFrame()
    }

    private registerEventOnFrame(event: string): void {
        if (!this.frame.onEventAttached) {
            this.frame.SetScript('OnEvent', (event: string, ...args: any[]) => {
                for (const [handlerEvent, handlers] of this._eventHandlers) {
                    if (handlerEvent === event) {
                        for (const handler of handlers) {
                            handler(...args)
                        }
                    }
                }
            })

            this.frame.onEventAttached = true
        }

        this.frame.RegisterEvent(event)
    }

    public RegisterEvent<T extends any[]>(event: string, handler: (...args: T) => void) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, [])
            this.registerEventOnFrame(event)
        }

        this._eventHandlers.get(event)!.push(handler as ((...args: any[]) => void))
    }
}
