export class Macros {
    public static *IterMacros() {
        const [global, perChar] = GetNumMacros()
        for (let index = 1; index <= global; index++) {
            const [name, icon, body] = GetMacroInfo(index)
            if (name !== undefined) {
                const macro: Macro = {
                    id: index,
                    name: name,
                    icon: icon,
                    body: body
                }

                yield macro
            }
        }

        for (let index = MAX_ACCOUNT_MACROS + 1; index <= MAX_ACCOUNT_MACROS + perChar; index++) {
            const [name, icon, body] = GetMacroInfo(index)
            if (name !== undefined) {
                const macro: Macro = {
                    id: index,
                    name: name,
                    icon: icon,
                    body: body
                }

                yield macro
            }
        }
    }
}
