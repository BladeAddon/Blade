export class BladeFrame {
    private readonly _frame: Frame = CreateFrame('Frame')
    private readonly _eventHandlers: LuaMap<string, Array<(...args: any[]) => void>> = new LuaMap()

    constructor() {
        this._frame.SetScript('OnEvent', (event: string, ...args: any[]) => {
            for (const [handlerEvent, handlers] of this._eventHandlers) {
                if (handlerEvent === event) {
                    for (const handler of handlers) {
                        handler(...args)
                    }
                }
            }
        })
    }

    public RegisterEvent(event: string, handler: (...args: any[]) => void) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, [])
            this._frame.RegisterEvent(event)
        }

        this._eventHandlers.get(event)!.push(handler)
    }
}
