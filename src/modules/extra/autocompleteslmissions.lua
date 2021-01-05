local ns, Blade = ...

-- CovenantMissionFrame.MissionComplete.CompleteFrame.ContinueButton
-- CovenantMissionFrame.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton

local hooked = false

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
                if not self or not self.MissionComplete then
                    return
                end

                if
                    self.MissionComplete.CompleteFrame and self.MissionComplete.CompleteFrame.ContinueButton and
                        self.MissionComplete.CompleteFrame.ContinueButton:IsVisible()
                 then
                    self.MissionComplete.CompleteFrame.ContinueButton:Click()
                end

                if
                    self.MissionComplete.RewardsScreen and self.MissionComplete.RewardsScreen.FinalRewardsPanel and
                        self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton and
                        self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton:IsVisible()
                 then
                    self.MissionComplete.RewardsScreen.FinalRewardsPanel.ContinueButton:Click()
                end
            end
        )

        hooked = true
    end
)

Blade:RegisterModule(
    "MODULES.EXTRA.AUTOCOMPLETESLMISSIONS",
    function(...)
    end
)
