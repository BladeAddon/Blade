local ns, Blade = ...
local moduleName = "MODULES.EXTRA.SPELLLOGGER"

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)

        local options = Blade:CreateSubOptions("Spelllogger")
        options:AddCheckButton(
            "ENABLED",
            "Enabled",
            "Saves all spells in a DB for searching and processing(Requires a reload after enabling or disabling)"
        ):BindToSetting(moduleName, "ENABLED")

        if not Blade:GetSetting(moduleName, "ENABLED") then
            return
        end

        if not BLADEDATA.SPELLLOG then
            BLADEDATA.SPELLLOG = {}
        end

        Blade:RegisterCommand(
            "spell",
            function(name)
                Blade:InfoMsg("Searching for spell " .. name)
                local f = false
                for k, v in pairs(BLADEDATA.SPELLLOG) do
                    if
                        strfind(strupper(tostring(v.ID)), strupper(name)) or
                            strfind(strupper(tostring(v.Name)), strupper(name))
                     then
                        f = true
                        Blade:Print(v.ID, "\124cffffd000\124Hspell:" .. v.ID .. "\124h[" .. v.Name .. "]\124h\124r")
                    end
                end
                if not f then
                    Blade:InfoMsg("Nothing found for spell " .. name)
                end
            end,
            "Search all logged spells for a given name"
        )

        Blade:RegisterEvent(
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

        Blade:RegisterCombatLogAffix("_CAST_START", AddFromCombatLog)
        Blade:RegisterCombatLogAffix("_CAST_SUCCESS", AddFromCombatLog)
    end
)
