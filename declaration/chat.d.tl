
global interface ChatCommand
    command: string
    description: string
    handler: function (args: {string})
end

global interface CommandHandler
    commands: {string: ChatCommand}
    display_help: function(self: CommandHandler)
    on_chat_command: function(self: CommandHandler, message: string, edit_box: any)
end

