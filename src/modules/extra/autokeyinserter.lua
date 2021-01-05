local ns, Blade = ...

local keystone_item_id = 180653

Blade:RegisterEvent(
    "CHALLENGE_MODE_KEYSTONE_RECEPTABLE_OPEN",
    function(...)
        local bag, slot = Blade:FindBagItemByID(keystone_item_id)
        if bag and slot then
            UseContainerItem(bag, slot)
            return
        end
    end
)

Blade:RegisterModule(
    "MODULES.EXTRA.AUTOKEYINSERTER",
    function(...)
    end
)
