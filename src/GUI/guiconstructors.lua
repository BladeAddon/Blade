local ns, Blade = ...

local smed

local function getFont()
    return smed:Fetch("font", "Myriad Condensed Web")
end

local function getTexture()
    return smed:Fetch("statusbar", "Minimalist")
end

local darkGrey = 0.11764705882
local r, g, b = darkGrey, darkGrey, darkGrey

local movingHandlers = {}
Blade.MOVING = false

local function onDragStart(frame)
    if Blade.MOVING then
        frame:StartMoving()
    end
end
local function onDragStop(frame)
    if Blade.MOVING then
        frame:StopMovingOrSizing()
    end
end

local function addOnUpdate(frame, handler)
    table.insert(frame.onupdatehandlers, handler)
end
local function addOnClick(frame, handler)
    table.insert(frame.onclickhandlers, handler)
end

local function addText(frame, text, size, autosize, flags)
    local textType = type(text)
    size = size or 14

    local fstr
    if frame.cd ~= nil then
        fstr = frame.cd:CreateFontString(nil, "OVERLAY")
    else
        fstr = frame:CreateFontString(nil, "OVERLAY")
    end

    fstr:SetTextColor(1.0, 1.0, 1.0)
    fstr:SetFont(getFont(), size, flags)
    fstr:SetSize(frame:GetWidth(), frame:GetHeight())

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

    if textType == "function" then
        frame:AddOnUpdate(
            function(f, sinceLastUpdate)
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
        )
    end
end

local function LoadFramePos(frame, posTable)
    frame:ClearAllPoints()
    local p = posTable
    frame:SetPoint(p["from"], UIParent, p["to"], p["x"], p["y"])
end

local function LoadFrame(frame, name)
    if not BLADEDATA.FRAMES[name] then
        return false
    end

    frame:LoadFramePos(BLADEDATA.FRAMES[name])

    return true
end

local function SaveFramePos(frame, name)
    if not frame.movingtex and frame.AddOnUpdate then
        local t = frame:CreateTexture()
        frame.movingtex = t
        t:SetTexture(getTexture())
        t:SetAllPoints()
        t:SetColorTexture(r, g, b)
        local fstr = frame:CreateFontString()
        t.text = fstr

        fstr:SetFont(getFont(), 16)
        fstr:SetTextColor(1.0, 1.0, 1.0)
        fstr:SetDrawLayer("OVERLAY", 127)
        fstr:SetText(name and name or frame.name and frame.name or "Unnamed")
        fstr:SetAllPoints()
        t:Hide()
        fstr:Hide()

        local onupdatefunction = function(f)
            if f.movingtex then
                if Blade.MOVING then
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
        -- frame:AddOnUpdate(onupdatefunction)
        -- onupdatefunction(frame, 0)
        frame:OnToggleMove(onupdatefunction)
    end

    frame:HookScript(
        "OnDragStop",
        function()
            local from, _, to, x, y = frame:GetPoint()
            BLADEDATA.FRAMES[name] = {
                ["from"] = from,
                ["to"] = to,
                ["x"] = x,
                ["y"] = y
            }
        end
    )
end

local function HandleFramePos(frame, name, defaultPos)
    if frame and frame.createdparent then
        frame = frame.createdparent
    end
    if not frame:LoadFrame(name) then
        frame:SetPoint(defaultPos and defaultPos or "CENTER")
    end

    frame:SaveFramePos(name)
end

Blade.HandleFramePos = HandleFramePos

local lastmove = Blade.MOVING

function Blade:CreateFrame(background, parent, name)
    local f = CreateFrame("Frame", name, parent or UIParent)
    f:SetMovable(Blade.MOVING)
    f:EnableMouse(Blade.MOVING)
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", onDragStart)
    f:SetScript("OnDragStop", onDragStop)
    if background then
        local t = f:CreateTexture()
        f.background = t
        t:SetTexture(getTexture())
        t:SetAllPoints()
        t:SetColorTexture(r, g, b)
    end

    f.onupdatehandlers = {}
    f.on_toggle_move_handlers = {}

    function f:AddOnUpdate(...)
        if not self.onUpdateActive then
            self:SetScript(
                "OnUpdate",
                function(frame, sinceLastUpdate)
                    for i = 1, #frame.onupdatehandlers do
                        frame.onupdatehandlers[i](frame, sinceLastUpdate)
                    end
                end
            )
            self.onUpdateActive = true
        end

        addOnUpdate(self, ...)
    end

    function f:RemoveOnUpdate(...)
        for i = 1, #self.onupdatehandlers do
            if self.onupdatehandlers[i] == ... then
                table.remove(self.onupdatehandlers, i)
                break
            end
        end
    end

    f.LoadFramePos = LoadFramePos
    f.LoadFrame = LoadFrame
    f.SaveFramePos = SaveFramePos
    f.HandleFramePos = HandleFramePos

    local function setMoving()
        f:SetMovable(Blade.MOVING)
        f:EnableMouse(Blade.MOVING)

        for i = 1, #f.on_toggle_move_handlers do
            f.on_toggle_move_handlers[i](f)
        end
    end

    function f:OnToggleMove(handler)
        if not self.on_toggle_move_handlers then
            self.on_toggle_move_handlers = {}
        end

        table.insert(self.on_toggle_move_handlers, handler)
    end

    function f:AutoSize()
        if not parent then
            local kids = {self:GetChildren()}

            if #kids > 0 then
                local totalWidth = 0
                local visibleWidth = 0
                local maxHeight = 0
                for i, child in ipairs(kids) do
                    if Blade.MOVING then
                        child.wasshown = child:IsShown()
                        child:Hide()
                    elseif not Blade.MOVING and child.wasshown then
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

                self:SetWidth(totalWidth)
                self:SetHeight(maxHeight)
            end
        end
    end

    function f:AddText(...)
        addText(self, ...)
        self:AutoSize()
    end

    table.insert(movingHandlers, setMoving)

    f:AutoSize()
    setMoving()
    return f
end

function Blade:CreateButton(onclick, name, parent)
    local f = CreateFrame("Button", name, parent or UIParent)
    f:SetWidth(32)
    f:SetHeight(32)

    local t = f:CreateTexture()
    f.background = t
    t:SetTexture(getTexture())
    t:SetAllPoints()
    t:SetColorTexture(r, g, b)

    f:EnableMouse(true)
    f:SetMovable(false)
    f:RegisterForClicks("AnyUp")
    f:RegisterForDrag("LeftButton")
    f:SetScript("OnDragStart", f.StartMoving)
    f:SetScript("OnDragStop", f.StopMovingOrSizing)

    f.onupdatehandlers = {}
    f.AddOnUpdate = addOnUpdate

    function f:AddOnUpdate(...)
        if not self.onUpdateActive then
            self:SetScript(
                "OnUpdate",
                function(frame, sinceLastUpdate)
                    for i = 1, #frame.onupdatehandlers do
                        frame.onupdatehandlers[i](frame, sinceLastUpdate)
                    end
                end
            )
            self.onUpdateActive = true
        end

        addOnUpdate(self, ...)
    end

    f.onclickhandlers = {}
    f.AddOnClick = addOnClick

    f.AddText = addText

    f:SetScript("OnClick", onclick)
    f:Show()

    if parent.AutoSize then
        parent:AutoSize()
    end

    return f
end

function Blade:CreateText(text, size, flags, parent)
    local f = self.CreateFrame(false, parent, nil)
    if not parent then
        f:SetPoint("CENTER")
        f:SetSize(64, 64)
    end

    f:AddText(text, size, true, flags)

    f:Show()
    f:AutoSize()
    return f
end

function Blade:CreateIcon(iconID, size, x, y, parent)
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

Blade:RegisterCommand(
    "togglemove",
    function()
        Blade.MOVING = not Blade.MOVING
        for i = 1, #movingHandlers do
            movingHandlers[i]()
        end
    end,
    "Toggle moving of all Blade Frame elements"
)

Blade:Init(
    function(...)
        if not BLADEDATA.FRAMES then
            BLADEDATA.FRAMES = {}
        end

        smed = LibStub("LibSharedMedia-3.0")
        smed:Register(
            "font",
            "Myriad Condensed Web",
            "Interface\\AddOns\\Blade\\media\\fonts\\Myriad Condensed Web.ttf"
        )
        smed:Register("statusbar", "Minimalist", "Interface\\AddOns\\Blade\\media\\textures\\Minimalist.tga")
    end
)
