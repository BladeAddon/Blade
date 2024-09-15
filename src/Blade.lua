local ns, addon = ...

local ace_addon = LibStub("AceAddon-3.0"):NewAddon("Blade")

function ace_addon:OnInitialize()
    if not BLADEDATA then
        BLADEDATA = {}
    end

    if not BLADEDATA.Settings then
        BLADEDATA.Settings = {}
    end
end
