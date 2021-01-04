local ns, BLADE = ...

if not BLADEDATA.AURALOG then
    BLADEDATA.AURALOG = {}
end
if not BLADEDATA.AURALOG.DEBUFFS then
    BLADEDATA.AURALOG.DEBUFFS = {}
end
if not BLADEDATA.AURALOG.BUFFS then
    BLADEDATA.AURALOG.BUFFS = {}
end
if not BLADEDATA.AURALOG.OTHER then
    BLADEDATA.AURALOG.OTHER = {}
end

local YELLOW = "|cffffd000"

local function GetSpellTooltipForNameAndID(id, name)
    return BLADE:EncodeInColor("|Hspell:" .. id .. "|h[" .. name .. "]|h", YELLOW)
end

local function PrintSearchInSpellObjects(spellObjs, needle)
    local foundSomething = false
    for k, v in pairs(spellObjs) do
        if strfind(strupper(tostring(v.ID)), strupper(needle)) or strfind(strupper(tostring(v.Name)), strupper(needle)) then
            foundSomething = true
            BLADE:Print(v.ID, GetSpellTooltipForNameAndID(v.ID, v.Name))
        end
    end

    return foundSomething
end

BLADE:RegisterCommand(
    "debuff",
    function(name)
        BLADE:InfoMsg("Searching for debuff " .. name)
        if not PrintSearchInSpellObjects(BLADEDATA.AURALOG.DEBUFFS, name) then
            BLADE:InfoMsg("Nothing found for debuff " .. name)
        end
    end
)

BLADE:RegisterCommand(
    "buff",
    function(name)
        BLADE:InfoMsg("Searching for buff " .. name)
        if not PrintSearchInSpellObjects(BLADEDATA.AURALOG.BUFFS, name) then
            BLADE:InfoMsg("Nothing found for buff " .. name)
        end
    end
)

BLADE:RegisterCommand(
    "aura",
    function(name)
        BLADE:InfoMsg("Searching for aura " .. name)
        local allAuras = {}
        for k, v in pairs(BLADEDATA.AURALOG.BUFFS) do
            allAuras[k] = v
        end
        for k, v in pairs(BLADEDATA.AURALOG.DEBUFFS) do
            allAuras[k] = v
        end
        for k, v in pairs(BLADEDATA.AURALOG.OTHER) do
            allAuras[k] = v
        end
        if not PrintSearchInSpellObjects(allAuras, name) then
            BLADE:InfoMsg("Nothing found for aura " .. name)
        end
    end
)

BLADE:RegisterCombatLogAffix(
    "_AURA_APPLIED",
    function(...)
        local t = {...}

        local sourceGUID = t[4]
        local destGUID = t[8]

        local spellID = t[12]
        local name, rank, icon, castTime, minRange, maxRange, spellId = GetSpellInfo(spellID)
        local school = t[14]
        local auraType = t[15]
        local amount = t[16]

        local spellObj = {
            ID = spellID,
            Name = name,
            Icon = icon,
            CastTime = castTime,
            MinRange = minRange,
            MaxRange = maxRange
        }

        if auraType == "DEBUFF" then
            BLADEDATA.AURALOG.DEBUFFS[spellID] = spellObj
        elseif auraType == "BUFF" then
            BLADEDATA.AURALOG.BUFFS[spellID] = spellObj
        else
            BLADEDATA.AURALOG.OTHER[spellID] = spellObj
        end
    end
)

BLADE:RegisterModule(
    "MODULES.EXTRA.AURALOGGER",
    function(...)
    end
)
