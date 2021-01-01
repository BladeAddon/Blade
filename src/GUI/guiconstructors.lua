local ns, BLADE = ...

local minimalist = "Interface\\AddOns\\Shadowlegend\\media\\textures\\Minimalist.tga"
local myriad = "Interface\\AddOns\\Shadowlegend\\media\\fonts\\Myriad Condensed Web.ttf"

local darkGrey = 0.11764705882
local r, g, b = darkGrey, darkGrey, darkGrey

if not BLADE.DATA["frames"] then
    BLADE.DATA["frames"] = {}
end

BLADE.moving = false

local function onDragStart(frame)
    if BLADE.MOVING then
        frame:StartMoving()
    end
end
local function onDragStop(frame)
    if BLADE.MOVING then
        frame:StopMovingOrSizing()
    end
end

SL.RegisterAPI(
    function(self)
        if not BLADE.DATA["frames"] then
            BLADE.DATA["frames"] = {}
        end

        local addOnUpdate = function(frame, handler)
            table.insert(frame.onupdatehandlers, handler)
        end
        local addOnClick = function(frame, handler)
            table.insert(frame.onclickhandlers, handler)
        end
        local addText = function(frame, text, size, autosize, flags)
            local textType = type(text)
            size = size or 14

            local fstr
            if frame.cd ~= nil then
                fstr = frame.cd:CreateFontString(nil, "OVERLAY", "GameFontNormal")
            else
                fstr = frame:CreateFontString(nil, "OVERLAY", "GameFontNormal")
            end

            -- fstr:SetFont(myriad, size, flags)
            fstr:SetTextColor(1.0, 1.0, 1.0)
            -- fstr:SetDrawLayer("OVERLAY", 1337)

            frame.fontString = fstr
            frame.text = fstr
            frame.Text = fstr

            if textType == "string" then
                fstr:SetText(text)
                if autosize then
                    local textw, texth = fstr:GetStringWidth(), fstr:GetStringHeight()
                    if frame:GetWidth() < textw then
                        frame:SetWidth(textw)
                    end
                    if frame:GetHeight() < texth then
                        frame:SetHeight(texth)
                    end
                end
            end

            fstr:SetAllPoints()

            frame:AddOnUpdate(
                function(f, sinceLastUpdate)
                    if textType == "function" then
                        f.text:SetText(text(f))
                        if autosize then
                            local textw, texth = fstr:GetStringWidth(), fstr:GetStringHeight()
                            if frame:GetWidth() < textw then
                                frame:SetWidth(textw)
                            end
                            if frame:GetHeight() < texth then
                                frame:SetHeight(texth)
                            end
                        end
                    end
                end
            )
        end

        self.LoadFramePos = function(frame, posTable)
            frame:ClearAllPoints()
            local p = posTable
            frame:SetPoint(p["from"], UIParent, p["to"], p["x"], p["y"])
        end

        self.LoadFrame = function(frame, name)
            if not SLDATA["frames"] then
                SLDATA["frames"] = {}
            end

            if not SLDATA["frames"][name] then
                return false
            end

            self.LoadFramePos(frame, SLDATA["frames"][name])

            return true
        end

        self.SaveFramePos = function(frame, name)
            if not SLDATA["frames"] then
                SLDATA["frames"] = {}
            end

            if not frame.movingtex and frame.AddOnUpdate then
                local t = frame:CreateTexture()
                frame.movingtex = t
                t:SetTexture(minimalist)
                t:SetAllPoints()
                t:SetColorTexture(r, g, b)
                local fstr = frame:CreateFontString()
                t.text = fstr

                fstr:SetFont(myriad, 16)
                fstr:SetTextColor(1.0, 1.0, 1.0)
                fstr:SetDrawLayer("OVERLAY", 1337)
                fstr:SetText(name or "Unnamed")
                fstr:SetAllPoints()
                t:Hide()
                fstr:Hide()

                frame:AddOnUpdate(
                    function(f, sinceLastUpdate)
                        if f.movingtex then
                            if SL.MOVING then
                                f.movingtex:Show()
                                f.movingtex.text:Show()

                                -- make this logic better, idea: create container on save call and put all childs in there so we can hide container
                                local kids = {frame:GetChildren()}
                                if #kids > 0 then
                                    local totalWidth = 0
                                    local visibleWidth = 0
                                    local maxHeight = 0
                                    for i, child in ipairs(kids) do
                                        if child:IsShown() then
                                            child:Hide()
                                        end
                                    end
                                end
                            else
                                f.movingtex:Hide()
                                f.movingtex.text:Hide()
                            end
                        end
                    end
                )
            end

            frame:HookScript(
                "OnDragStop",
                function()
                    local from, _, to, x, y = frame:GetPoint()
                    SLDATA["frames"][name] = {
                        ["from"] = from,
                        ["to"] = to,
                        ["x"] = x,
                        ["y"] = y
                    }
                end
            )
        end

        self.HandleFramePos = function(frame, name, defaultPos)
            if frame and frame.createdparent then
                frame = frame.createdparent
            end
            if not self.LoadFrame(frame, name) then
                frame:SetPoint(defaultPos or "CENTER")
            end

            self.SaveFramePos(frame, name)
        end

        local lastmove = SL.MOVING

        self.CreateFrame = function(background, parent, name)
            local f = CreateFrame("Frame", name, parent or UIParent)
            f:SetMovable(SL.MOVING)
            f:EnableMouse(SL.MOVING)
            f:RegisterForDrag("LeftButton")
            f:SetScript("OnDragStart", onDragStart)
            f:SetScript("OnDragStop", onDragStop)
            if background then
                local t = f:CreateTexture()
                f.background = t
                t:SetTexture(minimalist)
                t:SetAllPoints()
                t:SetColorTexture(r, g, b)
            end

            f.onupdatehandlers = {}
            f.AddOnUpdate = addOnUpdate

            f.AddText = addText

            f:SetScript(
                "OnUpdate",
                function(frame, sinceLastUpdate)
                    if SL.MOVING then
                        frame:SetMovable(true)
                        frame:EnableMouse(true)
                    elseif not SL.MOVING then
                        frame:SetMovable(false)
                        frame:EnableMouse(false)
                    end

                    if not parent then
                        local kids = {frame:GetChildren()}

                        if #kids > 0 then
                            local totalWidth = 0
                            local visibleWidth = 0
                            local maxHeight = 0
                            for i, child in ipairs(kids) do
                                if SL.MOVING and not lastmove then
                                    child.wasshown = child:IsShown()
                                    child:Hide()
                                elseif not SL.MOVING and lastmove and child.wasshown then
                                    child:Show()
                                end
                                if child:IsShown() then
                                    child:ClearAllPoints()
                                    child:SetPoint("TOPLEFT", visibleWidth, 0)
                                    visibleWidth = visibleWidth + child:GetWidth()
                                end
                                totalWidth = totalWidth + child:GetWidth()
                                local h = child:GetHeight()
                                if h > maxHeight then
                                    maxHeight = h
                                end
                            end

                            frame:SetWidth(totalWidth)
                            frame:SetHeight(maxHeight)
                        end
                    end

                    for i = 1, #frame.onupdatehandlers do
                        frame.onupdatehandlers[i](frame, sinceLastUpdate)
                    end

                    lastmove = SL.MOVING
                end
            )

            return f
        end

        -- FIX BUTTON
        -----------------------------------------------------------------------
        -- self.CreateButton = function(parent, name)
        --     local f = CreateFrame("Button", name, parent or UIParent, "UIPanelButtonTemplate")

        --     f:SetNormalTexture("Interface/Buttons/UI-Panel-Button-Up")
        --     f:SetHighlightTexture("Interface/Buttons/UI-Panel-Button-Highlight")
        --     f:SetPushedTexture("Interface/Buttons/UI-Panel-Button-Down")

        --     f:EnableMouse(true)
        --     f:SetMovable(SL.MOVING)
        --     f:RegisterForDrag("LeftButton")
        --     f:SetScript("OnDragStart", onDragStart)
        --     f:SetScript("OnDragStop", onDragStop)

        --     if not parent then
        --         f:SetPoint("CENTER")
        --         f:SetSize(64, 64)
        --     end

        --     f.onupdatehandlers = {}
        --     f.AddOnUpdate = addOnUpdate

        --     f.AddText = addText

        --     f:SetScript(
        --         "OnUpdate",
        --         function(frame, sinceLastUpdate)
        --             if SL.MOVING then
        --                 frame:SetMovable(true)
        --             else
        --                 frame:SetMovable(false)
        --             end

        --             for i = 1, #frame.onupdatehandlers do
        --                 frame.onupdatehandlers[i](frame, sinceLastUpdate)
        --             end
        --         end
        --     )
        --     f:Show()
        --     return f
        -- end

        self.CreateButton = function(onclick, name, parent)
            local f = CreateFrame("Button", name, parent or UIParent)
            f:SetWidth(32)
            f:SetHeight(32)

            local t = f:CreateTexture()
            f.background = t
            t:SetTexture(minimalist)
            t:SetAllPoints()
            t:SetColorTexture(r, g, b)

            f:EnableMouse(true)
            f:SetMovable(true)
            f:RegisterForClicks("AnyUp")
            f:RegisterForDrag("LeftButton")
            f:SetScript("OnDragStart", f.StartMoving)
            f:SetScript("OnDragStop", f.StopMovingOrSizing)

            f.onupdatehandlers = {}
            f.AddOnUpdate = addOnUpdate

            f.onclickhandlers = {}
            f.AddOnClick = addOnClick

            f.AddText = addText

            f:SetScript(
                "OnUpdate",
                function(frame, sinceLastUpdate)
                    -- if SL.MOVING then
                    --     frame:SetMovable(true)
                    -- else
                    --     frame:SetMovable(false)
                    -- end

                    for i = 1, #frame.onupdatehandlers do
                        frame.onupdatehandlers[i](frame, sinceLastUpdate)
                    end
                end
            )

            f:SetScript("OnClick", onclick)
            f:Show()
            return f
        end
        -----------------------------------------------------------------------

        self.CreateText = function(text, size, flags, parent)
            local f = self.CreateFrame(false, parent, nil)
            if not parent then
                f:SetPoint("CENTER")
                f:SetSize(64, 64)
            end

            f:AddText(text, size, true, flags)

            f:Show()
            return f
        end

        self.CreateIcon = function(iconID, size, x, y, parent)
            flags = flags or nil
            x = x or 0
            y = y or 0
            size = size or 32

            local f = self.CreateFrame(false, parent, nil)
            if not parent then
                f:SetPoint("TOPLEFT", x, y)
                f:SetSize(size, size)
            end

            local t = f:CreateTexture()
            f.icon = t
            t:SetTexture(iconID)
            t:SetAllPoints()

            f:Show()
            return f
        end

        self.CreateTimedIcon = function(iconID, time, size, parent, x, y)
            flags = flags or nil
            x = x or 0
            y = y or 0
            size = size or 32

            local b = false
            if not parent then
                parent = self.CreateFrame()
                b = true
            end

            local f = self.CreateFrame(false, parent, nil)
            f.iconID = iconID
            if b then
                f.createdparent = parent
            end
            if not parent then
                f:SetPoint("TOPLEFT", x, y)
            else
                f:SetPoint("TOPLEFT", parent)
            end
            f:SetSize(size, size)

            local t = f:CreateTexture()
            f.icon = t
            t:SetTexture(iconID)
            t:SetAllPoints()

            f.creation = GetTime()
            -- local fstr = f:CreateFontString()
            -- f.timer = fstr
            -- f.timer.creation = GetTime()

            -- fstr:SetFont(myriad, size * 0.7, "THICKOUTLINE")
            -- fstr:SetTextColor(1, 0.90588235294, 0.14117647058)

            -- fstr:SetAllPoints()

            f:AddOnUpdate(
                function(_, sinceLastUpdate)
                    local remaining = GetTime() - f.creation
                    if remaining >= time then
                        f:Hide()
                    end
                end
            )

            local cd = CreateFrame("Cooldown", nil, f, "CooldownFrameTemplate")
            f.cd = cd
            cd:SetHideCountdownNumbers(false)
            cd:SetAllPoints()
            cd:SetCooldown(GetTime(), time)

            f.Reshow = function(frame, newTime)
                f.creation = GetTime()
                cd:SetCooldown(0, 0)
                cd:SetCooldown(GetTime(), newTime or time)
                f:Show()
            end

            f:Show()
            return f
        end

        self.FixHideCd = function(cdframe)
            local AG = cdframe:CreateAnimationGroup()
            local A = AG:CreateAnimation("Alpha")

            AG:SetLooping("NONE")
            A:SetOrder(1)
            A:SetDuration(0)

            A:SetFromAlpha(1)
            A:SetToAlpha(1)

            cdframe.AG = AG
            cdframe.A = A
        end

        self.CreateBuffIcon = function(spell, timeins, size, parent)
            local icon = self.CreateTimedIcon(SL.SpellIcon(spell), timeins, size, parent)
            icon.spell = spell

            self.RegisterCombatLogEvent(
                "SPELL_CAST_SUCCESS",
                function(...)
                    local t = {...}
                    local sourceGUID = t[4]
                    local destGUID = t[8]
                    if destGUID ~= self.Player.guid and sourceGUID ~= self.Player.guid then
                        return
                    end

                    local spellID = t[12]
                    local spellName = t[13]
                    if spellID == spell or spellName == spell then
                        icon:Reshow()
                    end
                end
            )

            self.RegisterCombatLogAffix(
                "_AURA_REMOVED",
                function(...)
                    local t = {...}
                    local sourceGUID = t[4]
                    local destGUID = t[8]
                    if destGUID ~= self.Player.guid and sourceGUID ~= self.Player.guid then
                        return
                    end

                    local spellID = t[12]
                    local spellName = t[13]
                    if spellID == spell or spellName == spell then
                        icon:Hide()
                    end
                end
            )

            self.RegisterCombatLogAffix(
                "_AURA_REFRESH",
                function(...)
                    local t = {...}
                    local sourceGUID = t[4]
                    local destGUID = t[8]
                    if destGUID ~= self.Player.guid and sourceGUID ~= self.Player.guid then
                        return
                    end

                    local spellID = t[12]
                    local spellName = t[13]
                    if spellID == spell or spellName == spell then
                        icon:Reshow()
                    end
                end
            )

            self.RegisterCombatLogEvent(
                "UNIT_DIED",
                function(...)
                    local t = {...}
                    local destGUID = t[8]
                    if destGUID ~= self.Player.guid then
                        return
                    end

                    icon:Hide()
                end
            )

            return icon
        end
    end
)
