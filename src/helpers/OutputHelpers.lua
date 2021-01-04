local ns, BLADE = ...

local COBALT_BLUE = "|cFF0047AB"
local WHITE = "|cFFFFFFFF"
local RETURN_COLOR = "|r"

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
        BLADE:EncodeInColor(BLADE.AddonName, COBALT_BLUE) .. BLADE:EncodeInColor("]", WHITE)
end

function BLADE:Print(...)
    print(GetPrintPrefix(), ...)
end
