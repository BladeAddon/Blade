local ns, Blade = ...

local moduleName = "MODULES.BOSSMODS.BIGWIGSAPI"

local BigWigsAddon = "BigWigs"
local BigWigsMod = {}

local timers = {}

--BigWigs
--BigWigsLoader
--RegisterMessage

--core:SendMessage("BigWigs_StartBar", core, msg, msg, time, icon)
--self:SendMessage("BigWigs_StartBar", self, key, msg, length, icons[icon or textType == "number" and text or key])
--self:SendMessage("BigWigs_StartCountdown", self, key, msg, length)

Blade:OnAddon(
    BigWigsAddon,
    function()
        if not BigWigsLoader then
            error("BigWigs not loaded or BigWigsLoader doesn't exist anymore?")
        end

        BigWigsLoader.RegisterMessage(
            BigWigsMod,
            "BigWigs_StartBar",
            -- key might be spell id
            function(key, msg, length, icon)
                if not timers[key] then
                    timers[key] = {}
                end

                timers[key][msg] = {Key = key, Message = msg, Length = length, Icon = icon, Time = GetTime()}

                print(moduleName, key, msg, length, icon)
            end
        )
    end
)

Blade:RegisterModule(
    moduleName,
    function(...)
    end
)
