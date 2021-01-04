local ns, BLADE = ...

function BLADE:InfoMsg(msg, duration)
    if not duration then
        duration = 10
    end
    RaidNotice_AddMessage(RaidBossEmoteFrame, msg, ChatTypeInfo.SYSTEM, duration)
end
