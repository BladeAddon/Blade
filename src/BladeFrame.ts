import { Frame, TypedEvents } from '@wartoshika/wow-declarations'

export class BladeFrame {
    private static s_instance: BladeFrame | undefined

    public static get instance(): BladeFrame {
        if (!BladeFrame.s_instance) {
            BladeFrame.s_instance = new BladeFrame()
        }

        return BladeFrame.s_instance
    }

    private readonly _frame: Frame = CreateFrame('Frame')
    private readonly _onUpdateHandlers: Array<() => void> = []
    private readonly _eventHandlers: LuaMap<string, Array<(...args: any[]) => void>> = new LuaMap()

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

        this._eventHandlers.get(event)!.push(handler)
    }
}
