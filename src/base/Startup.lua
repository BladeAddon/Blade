local ns, Blade = ...

Blade.onFrameHandlers = {}
Blade.inits = {}
Blade.addonHandlers = {}

local addonLoaded = IsAddOnLoaded

function Blade:OnFrame(func)
    table.insert(self.onFrameHandlers, func)
end

function Blade:Init(handler)
    table.insert(self.inits, handler)

    if self.Loaded then
        handler()
    end
end

function Blade:OnAddon(addonName, handler)
    if addonLoaded(addonName) then
        handler()
    else
        if not self.addonHandlers[addonName] then
            self.addonHandlers[addonName] = {}
        end

        table.insert(self.addonHandlers[addonName], handler)
    end
end

local loadedaddons = {}
Blade:RegisterEvent(
    "ADDON_LOADED",
    function(addon)
        loadedaddons[addon] = true
        if Blade.addonHandlers[addon] then
            for _, v in ipairs(Blade.addonHandlers[addon]) do
                v()
            end
        end

        if addon == Blade.AddonName then
            for k, v in pairs(Blade.inits) do
                v()
            end

            Blade.Loaded = true
        end
    end
)

function Blade:IsAddonLoaded(addon)
    return loadedaddons[addon] == true or addonLoaded(addon)
end

Blade:RegisterEvent(
    "PLAYER_ENTERING_WORLD",
    function()
        Blade.Player.guid = Blade.Player._guid()
    end
)

Blade.frame:SetScript(
    "OnUpdate",
    function(f, sinceLastUpdate)
        for i = 1, #Blade.onFrameHandlers do
            local func = Blade.onFrameHandlers[i]
            if func ~= nil then
                func(Blade, sinceLastUpdate)
            end
        end
    end
)

Blade:Init(
    function()
        for moduleName, moduleBootstrap in pairs(Blade.modules) do
            moduleBootstrap(Blade)
        end
    end
)
