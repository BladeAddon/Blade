export class Items {
    public LoadItems(itemIDs: number[], handler: () => void): void {
        const items = new Set<number>(itemIDs)
        const numToLoad = items.size
        let numLoaded = 0

        for (const item of items) {
            const itemMixin = Item.CreateFromItemID(item)
            itemMixin.ContinueOnItemLoad(() => {
                numLoaded++
                if (numToLoad === numLoaded) {
                    handler()
                }
            })
        }
    }
}
