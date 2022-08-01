import { Frame, TypedEvents } from '@wartoshika/wow-declarations'

export class BladeFrame {
    private static _instance: BladeFrame | undefined

    static get instance(): BladeFrame {
        if (!BladeFrame._instance) {
            BladeFrame._instance = new BladeFrame()
        }

        return BladeFrame._instance
    }

    private readonly _frame: Frame = CreateFrame('Frame')
    private readonly _onUpdateHandlers: Array<() => void> = []
    private readonly _eventHandlers: LuaTable<string, Array<(...args: any[]) => void>> = new LuaTable()

    constructor() {
        this._frame.SetScript('OnUpdate', () => {
            for (const handler of this._onUpdateHandlers) {
                handler()
            }
        })

        this._frame.SetScript('OnEvent', (_: Frame, event: string, ...args: any[]) => {
            for (const [handlerEvent, handlers] of this._eventHandlers) {
                if (handlerEvent === event) {
                    for (const handler of handlers) {
                        handler(...args)
                    }
                }
            }
        })
    }

    public OnUpdate(handler: () => void) {
        this._onUpdateHandlers.push(handler)
    }

    public RegisterEvent(event: string, handler: (...args: any[]) => void) {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, [])
            this._frame.RegisterEvent(event as keyof TypedEvents)
        }

        this._eventHandlers.get(event).push(handler)
    }
}
