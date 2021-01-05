local ns, Blade = ...

local COBALT_BLUE = "|cFF0047AB"
local DEEP_PINK = "|cFFff1493"
local WHITE = "|cFFFFFFFF"
local RETURN_COLOR = "|r"

Blade.ADDON_COLOR = DEEP_PINK

local print = print

function Blade:InfoMsg(msg, duration)
    if not duration then
        duration = 10
    end
    RaidNotice_AddMessage(RaidBossEmoteFrame, msg, ChatTypeInfo.SYSTEM, duration)
end

function Blade:EncodeInColor(str, color)
    return color .. str .. RETURN_COLOR
end

local function GetPrintPrefix()
    return Blade:EncodeInColor("[", WHITE) ..
        Blade:EncodeInColor(Blade.AddonName, Blade.ADDON_COLOR) .. Blade:EncodeInColor("]", WHITE)
end

function Blade:Print(...)
    print(GetPrintPrefix(), ...)
end
