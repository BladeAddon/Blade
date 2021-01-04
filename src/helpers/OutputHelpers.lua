local ns, BLADE = ...

local COBALT_BLUE = "|cFF0047AB"
local DEEP_PINK = "|cFFff1493"
local WHITE = "|cFFFFFFFF"
local RETURN_COLOR = "|r"

local ADDON_COLOR = DEEP_PINK

local print = print

function BLADE:InfoMsg(msg, duration)
    if not duration then
        duration = 10
    end
    RaidNotice_AddMessage(RaidBossEmoteFrame, msg, ChatTypeInfo.SYSTEM, duration)
end

function BLADE:EncodeInColor(str, color)
    return color .. str .. RETURN_COLOR
end

local function GetPrintPrefix()
    return BLADE:EncodeInColor("[", WHITE) ..
        BLADE:EncodeInColor(BLADE.AddonName, ADDON_COLOR) .. BLADE:EncodeInColor("]", WHITE)
end

function BLADE:Print(...)
    print(GetPrintPrefix(), ...)
end
