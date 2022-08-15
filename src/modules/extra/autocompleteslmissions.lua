local ns, Blade = ...

local moduleName = "MODULES.EXTRA.AUTOCOMPLETESLMISSIONS"

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)

        local options = Blade:CreateSubOptions("Auto Complete Mission Table")
        local enableButton =
            options:AddCheckButton("ENABLED", "Enabled", "Automatically completes missions from mission table")
        enableButton:BindToSetting(moduleName, "ENABLED")

        local hooked = false

        local blackList = {}
        local retryTime = 1

        Blade:RegisterEvent(
            "GARRISON_MISSION_NPC_OPENED",
            function(followerTypeID)
                -- make sure to apply hook only once
                if hooked then
                    return
                end

                local covenantMissionFrame = _G["CovenantMissionFrame"]
                covenantMissionFrame:HookScript(
                    "OnUpdate",
                    function(self, _)
                        if not Blade:GetSetting(moduleName, "ENABLED") then
                            return
                        end

                        for item, time in pairs(blackList) do
                            if GetTime() - time > retryTime then
                                blackList[item] = nil
                            end
                        end

                        if self:IsVisible() then
                            local completeMissions = C_Garrison.GetCompleteMissions(followerTypeID)
                            for i = 1, #completeMissions do
                                local missionID = completeMissions[i].missionID
                                if not blackList[missionID] then
                                    C_Garrison.RegenerateCombatLog(missionID)
                                    C_Garrison.MarkMissionComplete(missionID)
                                    C_Garrison.MissionBonusRoll(missionID)
                                    blackList[missionID] = GetTime()
                                    return
                                end
                            end
                        end
                    end
                )

                hooked = true
            end
        )
    end
)
