local ns, Blade = ...

function Blade:LinkToItemID(itemLink)
    local name, link, _ = GetItemInfo(itemLink)
    if not name or name == nil then
        return
    end
    local itemString = string.match(link, "item[%-?%d:]+")
    local itemId = string.match(itemString, "%d+")
    return tonumber(itemId)
end

function Blade:FindBagItemByID(itemIdToSearch)
    for bag = 0, NUM_BAG_SLOTS do
        for slot = 1, GetContainerNumSlots(bag) do
            local texture, count, locked, quality, readable, lootable, link, isFiltered, hasNoValue, itemID =
                GetContainerItemInfo(bag, slot)
            if itemID then
                local name, _, _, iLevel, reqLevel, class, subclass, maxStack, equipSlot, _, vendorPrice =
                    GetItemInfo(itemID)

                if itemIdToSearch == itemID then
                    return bag, slot
                end
            end
        end
    end
end
