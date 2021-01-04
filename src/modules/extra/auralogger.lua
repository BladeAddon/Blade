local ns, BLADE = ...

local data = BLADE.DATA
if not data.AURALOG then
    data.AURALOG = {}
end
local auralog = data.AURALOG
if not auralog.DEBUFFS then
    auralog.DEBUFFS = {}
end
if not auralog.BUFFS then
    auralog.BUFFS = {}
end
if not auralog.OTHER then
    auralog.OTHER = {}
end

local debuffs = auralog.DEBUFFS
local buffs = auralog.BUFFS
local other = auralog.OTHER

local function GetSpellTooltipForNameAndID(name, id)
    return "\124cffffd000\124Hspell:" .. id .. "\124h[" .. name .. "]\124h\124r"
end

local function PrintSearchInSpellObjects(spellObjs, needle)
    local foundSomething = false
    for k, v in pairs(spellObjs) do
        if strfind(strupper(tostring(v.ID)), strupper(needle)) or strfind(strupper(tostring(v.Name)), strupper(needle)) then
            foundSomething = true
            print(v.ID, GetSpellTooltipForNameAndID(v.ID, v.Name))
        end
    end

    return foundSomething
end

BLADE:RegisterCommand(
    "debuff",
    function(name)
        BLADE:InfoMsg("Searching for debuff " .. name)
        if not PrintSearchInSpellObjects(debuffs, name) then
            BLADE:InfoMsg("Nothing found for debuff " .. name)
        end
    end
)

BLADE:RegisterCommand(
    "buff",
    function(name)
        BLADE:InfoMsg("Searching for buff " .. name)
        if not PrintSearchInSpellObjects(buffs, name) then
            BLADE:InfoMsg("Nothing found for buff " .. name)
        end
    end
)

BLADE:RegisterCommand(
    "aura",
    function(name)
        BLADE:InfoMsg("Searching for aura " .. name)
        local f = false
        local allAuras = {}
        for k, v in pairs(buffs) do
            allAuras[k] = v
        end
        for k, v in pairs(debuffs) do
            allAuras[k] = v
        end
        for k, v in pairs(other) do
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
            debuffs[spellID] = spellObj
        elseif auraType == "BUFF" then
            buffs[spellID] = spellObj
        else
            other[spellID] = spellObj
        end
    end
)

BLADE:RegisterModule(
    "MODULES.EXTRA.AURALOGGER",
    function(...)
    end
)
