local ns, BLADE = ...

function BLADE:FindBagItemByID(itemIdToSearch)
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

BLADE:RegisterModule(
    "InventoryInfo",
    function(...)
    end
)
