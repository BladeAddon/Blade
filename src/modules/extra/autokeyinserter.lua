local ns, BLADE = ...

local keystone_item_id = 180653

BLADE:RegisterEvent(
    "CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN",
    function(...)
        local bag, slot = BLADE:FindBagItemByID(keystone_item_id)
        if bag and slot then
            UseContainerItem(bag, slot)
            return
        end
    end
)

BLADE:RegisterModule(
    "MODULES.EXTRA.AUTOKEYINSERTER",
    function(...)
    end
)
