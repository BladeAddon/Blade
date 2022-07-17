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

local function encodeInColor(str, color)
    return color .. str .. RETURN_COLOR
end

function Blade:EncodeInColor(str, color)
    return encodeInColor(str, color)
end

local function GetPrintPrefix()
    return encodeInColor("[", WHITE) .. encodeInColor(Blade.AddonName, Blade.ADDON_COLOR) .. encodeInColor("]", WHITE)
end

function Blade:Print(...)
    print(GetPrintPrefix(), ...)
end

function Blade:SendChat(msg)
    DEFAULT_CHAT_FRAME.editBox:SetText(msg)
    ChatEdit_SendText(DEFAULT_CHAT_FRAME.editBox, 0)
end
