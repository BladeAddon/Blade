local input: {string, Addon} = {...}
local ns = input[1]
local addon = input[2]

local lib_stub: AceAddon = LibStub("AceAddon-3.0")
local ace_addon: AceAddon = lib_stub:NewAddon(ns)

global BLADEDATA: { string: any }

function ace_addon:OnInitialize()
    if not BLADEDATA then
        BLADEDATA = {}
    end

    if not BLADEDATA.Settings then
        BLADEDATA.Settings = {}
    end

    addon.db = BLADEDATA
    addon.settings = BLADEDATA.Settings
    addon.ace_addon = ace_addon
end
