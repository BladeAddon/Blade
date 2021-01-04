local ns, BLADE = ...

BLADE:RegisterModule(
    "MODULES.EXTRA.SPELLLOGGER",
    function(...)
        if not BLADEDATA.SPELLLOG then
            BLADEDATA.SPELLLOG = {}
        end
    end
)

BLADE:RegisterCommand(
    "spell",
    function(name)
        BLADE:InfoMsg("Searching for spell " .. name)
        local f = false
        for k, v in pairs(BLADEDATA.SPELLLOG) do
            if strfind(strupper(tostring(v.ID)), strupper(name)) or strfind(strupper(tostring(v.Name)), strupper(name)) then
                f = true
                BLADE:Print(v.ID, "\124cffffd000\124Hspell:" .. v.ID .. "\124h[" .. v.Name .. "]\124h\124r")
            end
        end
        if not f then
            BLADE:InfoMsg("Nothing found for spell " .. name)
        end
    end
)

BLADE:RegisterEvent(
    "UNIT_SPELLCAST_SENT",
    function(unit, target, castGUID, spellID)
        local name, rank, icon, castTime, minRange, maxRange, spellId = GetSpellInfo(spellID)
        local spellObj = {
            ID = spellID,
            Name = name,
            Icon = icon,
            CastTime = castTime,
            MinRange = minRange,
            MaxRange = maxRange
        }
        BLADEDATA.SPELLLOG[spellID] = spellObj
    end
)

local function AddFromCombatLog(...)
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

    BLADEDATA.SPELLLOG[spellID] = spellObj
end

BLADE:RegisterCombatLogAffix("_CAST_START", AddFromCombatLog)
BLADE:RegisterCombatLogAffix("_CAST_SUCCESS", AddFromCombatLog)
