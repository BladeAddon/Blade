local ns, Blade = ...

local moduleName = "MODULES.EXTRA.AUTOCOMPLETESLMISSIONS"

local options = Blade:CreateSubOptions("Auto Complete Mission Table")
local enableButton = options:AddCheckButton("ENABLED", "Enabled", "Automatically completes missions from mission table")
enableButton:BindToSetting(moduleName, "ENABLED")

-- CovenantMissionFrame.MissionComplete.CompleteFrame.ContinueButton
-- CovenantMissionFrame.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton

local hooked = false

local blackList = {}
local retryTime = 30

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
            function(self, sinceLastUpdate)
                if not Blade:GetSetting(moduleName, "ENABLED") then
                    return
                end

                for item, time in pairs(blackList) do
                    if GetTime() - time > retryTime then
                        blackList[item] = nil
                    end
                end

                if not self or not self.MissionComplete or not self.MissionComplete:IsVisible() then
                    local cm = C_Garrison.GetCompleteMissions(followerTypeID)
                    for i = 1, #cm do
                        local missionID = cm[i].missionID
                        if not blackList[missionID] then
                            cm[i].encounterIconInfo = C_Garrison.GetMissionEncounterIconInfo(missionID)
                            self:InitiateMissionCompletion(cm[i])
                            blackList[missionID] = GetTime()
                            return
                        end
                    end
                end

                if
                    self.MissionComplete.RewardsScreen and self.MissionComplete.RewardsScreen.FinalRewardsPanel and
                        self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton and
                        self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton:IsVisible()
                 then
                    self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton:Click()
                    return
                end

                if
                    self.MissionComplete.CompleteFrame and self.MissionComplete.CompleteFrame.ContinueButton and
                        self.MissionComplete.CompleteFrame.ContinueButton:IsVisible()
                 then
                    self.MissionComplete.CompleteFrame.ContinueButton:Click()
                end
            end
        )

        hooked = true
    end
)

Blade:RegisterModule(
    moduleName,
    function(...)
        -- set default values
        Blade:GetSetting(moduleName, "ENABLED", true)
    end
)
