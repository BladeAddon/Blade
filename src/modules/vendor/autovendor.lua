local ns, Blade = ...

local moduleName = "MODULES.VENDOR.AUTOVENDOR"

local GameTooltip = GameTooltip

local toolTipHooks = {
    "SetMerchantItem",
    "SetBuybackItem",
    "SetBagItem",
    -- "SetAuctionItem",
    "SetLootRollItem",
    "SetInventoryItem",
    "SetGuildBankItem",
    "SetTradePlayerItem",
    "SetTradeTargetItem",
    "SetQuestItem",
    "SetInboxItem",
    "SetItemByID",
    -- "SetAuctionSellItem",
    "SetHyperlink",
    "SetLootItem",
    "SetSendMailItem"
}

local function tooltipHook(toolTip)
    local name, link = toolTip:GetItem()

    if not link then
        return
    end

    local itemID = Blade:LinkToItemID(link)
    if not itemID or itemID == nil then
        return
    end
    if BLADEDATA.AUTOSELL[itemID] then
        toolTip:AddLine("|cffffcc00Item is being automatically sold|r")
    end
    toolTip:Show()
end

local function HookToolTip()
    for _, v in ipairs(toolTipHooks) do
        hooksecurefunc(GameTooltip, v, tooltipHook)
    end
end

function Blade:AddAutoSell(item)
    local _, link, _ = GetItemInfo(item)

    local itemID = Blade:LinkToItemID(link)
    if not itemID or itemID == nil then
        Blade:Print(link, "is not a valid item")
        return
    end
    if BLADEDATA.AUTOSELL[itemID] == nil then
        BLADEDATA.AUTOSELL[itemID] = true
        Blade:Print("Added " .. link .. " to auto sell list.")
    else
        BLADEDATA.AUTOSELL[itemID] = nil
        Blade:Print("Removed " .. link .. " from auto sell list.")
    end
end

local blackList = {}

local function TrashItem(bag, slot, itemSellPrice, name, link, itemID)
    return {Bag = bag, Slot = slot, SellPrice = itemSellPrice, Name = name, Link = link, ItemID = itemID}
end

local function GetTrashItem()
    for bag = 0, NUM_BAG_SLOTS do
        for slot = 1, GetContainerNumSlots(bag) do
            local _, count, _, quality, _, _, link, _, _, itemID = GetContainerItemInfo(bag, slot)
            if itemID then
                local name, _, _, _, _, _, _, _, _, _, vendorPrice = GetItemInfo(itemID)

                local shouldSell =
                    ((quality == 0 and Blade:GetSetting(moduleName, "SELL_JUNK")) or
                    (BLADEDATA.AUTOSELL[itemID] and Blade:GetSetting(moduleName, "SELL_WHITELIST"))) and
                    not blackList[bag .. slot] and
                    vendorPrice and
                    vendorPrice > 0

                if shouldSell then
                    local itemSellPrice = vendorPrice * count
                    return TrashItem(bag, slot, itemSellPrice, name, link, itemID)
                end
            end
        end
    end
end

local function GetTrashItems()
    local trash = {}
    local totalVendor = 0
    for bag = 0, NUM_BAG_SLOTS do
        for slot = 1, GetContainerNumSlots(bag) do
            local _, count, _, quality, _, _, link, _, _, itemID = GetContainerItemInfo(bag, slot)
            if itemID then
                local name, _, _, _, _, _, _, _, _, _, vendorPrice = GetItemInfo(itemID)

                local shouldSell =
                    ((quality == 0 and Blade:GetSetting(moduleName, "SELL_JUNK")) or
                    (BLADEDATA.AUTOSELL[itemID] and Blade:GetSetting(moduleName, "SELL_WHITELIST"))) and
                    not blackList[bag .. slot] and
                    vendorPrice and
                    vendorPrice > 0

                if shouldSell then
                    local itemSellPrice = vendorPrice * count
                    totalVendor = totalVendor + itemSellPrice
                    table.insert(trash, TrashItem(bag, slot, itemSellPrice, name, link, itemID))
                end
            end
        end
    end

    return trash, totalVendor
end

local fastSell = false

local function SellItem(itemToSell)
    UseContainerItem(itemToSell.Bag, itemToSell.Slot)
end

local function SellItems(itemsToSell)
    for i, v in ipairs(itemsToSell) do
        SellItem(v)
    end
end

Blade:RegisterEvent(
    "MERCHANT_SHOW",
    function()
        if not Blade:GetSetting(moduleName, "ENABLED") then
            return
        end

        local itemsToSell = GetTrashItems()

        local sellAmount = 0

        for i, v in ipairs(itemsToSell) do
            sellAmount = sellAmount + v.SellPrice
        end
        if sellAmount > 0 then
            Blade:Print("Selling trash items for: " .. GetMoneyString(sellAmount))
        end

        if #itemsToSell > Blade:GetSetting(moduleName, "FAST_SELL_CAP") then
            fastSell = false
        else
            fastSell = true
            SellItems(itemsToSell)
        end
    end
)

Blade:RegisterCommand(
    "autosell",
    function(item)
        Blade:AddAutoSell(tostring(item))
    end,
    "Add or remove item to/from autosell list by linking it to this command with shift+click"
)

Blade:RegisterCommand(
    "importslvendor",
    function()
        for k, v in pairs(SLDATA["autosell"]) do
            BLADEDATA.AUTOSELL[k] = v
        end
    end
)

local options = Blade:CreateSubOptions("Auto Vendor")
local enableButton =
    options:AddCheckButton(
    "ENABLED",
    "Enabled",
    "Automatically sell grey and manually added items when a vendor is opened"
)
enableButton:BindToSetting(moduleName, "ENABLED")

local sellJunkButton = options:AddCheckButton("SELL_JUNK", "Sell junk items", "Enable auto sell for junk items")
sellJunkButton:BindToSetting(moduleName, "SELL_JUNK")

local sellWhitelistbutton =
    options:AddCheckButton("SELL_WHITELIST", "Sell whitelisted items", "Enable auto sell for whitelisted items")
sellWhitelistbutton:BindToSetting(moduleName, "SELL_WHITELIST")

-- panel, name, minValue, maxValue, stepValue, text, tooltipText
local fastSellCapSlider =
    options:AddSlider(
    "FAST_SELL_CAP",
    0,
    20,
    1,
    "Fast Sell Cap",
    "Amount of items to sell at once when opening window, lower this amount if items dont get sold or there are any errors"
)
fastSellCapSlider:BindToSetting(moduleName, "FAST_SELL_CAP")

Blade:RegisterModule(
    moduleName,
    function(...)
        if not BLADEDATA.AUTOSELL then
            BLADEDATA.AUTOSELL = {}
        end

        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
        Blade:GetSetting(moduleName, "SELL_JUNK", true)
        Blade:GetSetting(moduleName, "SELL_WHITELIST", true)
        Blade:GetSetting(moduleName, "FAST_SELL_CAP", 12)

        HookToolTip()

        local merchantFrame = _G["MerchantFrame"]
        merchantFrame:HookScript(
            "OnUpdate",
            function(frame, sinceLastUpdate)
                frame.sinceLastUpdate = (frame.sinceLastUpdate or 0) + sinceLastUpdate

                if not Blade:GetSetting(moduleName, "ENABLED") then
                    return
                end

                for item, time in pairs(blackList) do
                    if GetTime() - time > 0.3 then
                        blackList[item] = nil
                    end
                end

                if not fastSell then
                    local toSell = GetTrashItem()
                    if toSell then
                        SellItem(toSell)
                        blackList[toSell.Bag .. toSell.Slot] = GetTime()
                    end
                end
            end
        )
    end
)
