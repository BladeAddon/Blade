param (
    [Parameter()]
    [Alias("out")]
    [string]
    $output = "./out",

    [Parameter()]
    [string[]]
    $modules,

    [Parameter()]
    [switch]
    $allModules
)

$scriptTag = "Script"
$fileAttrib = "file"

$embeds = New-Object System.XML.XMLDocument
# $embeds.Load("$($output)/embeds.xml")
# <Ui xmlns="http://www.blizzard.com/wow/ui/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/../FrameXML/UI.xsd">

$ui = $embeds.CreateElement("Ui")

[void]$ui.SetAttribute("xmlns", "http://www.blizzard.com/wow/ui/")
[void]$ui.SetAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
[void]$ui.SetAttribute("xsi:schemaLocation", "http://www.blizzard.com/wow/ui/../FrameXML/UI.xsd")
[void]$embeds.AppendChild($ui)

$libIncludes = @(
    "Libs/LibStub/LibStub.lua",
    "Libs/LibRangeCheck-2.0/LibRangeCheck-2.0.lua",
    "Libs/LibSharedMedia-3.0/LibSharedMedia-3.0.lua"
)

$mediaIncludes = @(
    "media/fonts/Myriad Condensed Web.ttf",
    "media/textures/Minimalist.tga"
)

$baseIncludes = @(
    "base/Init.lua",
    "helpers/TableHelpers.lua",
    "helpers/OutputHelpers.lua",
    "modules/units/UnitInfos.lua",
    "base/Blade.lua",
    "commands/ChatCommands.lua",
    "events/EventHandlers.lua",
    "modules/InventoryInfo.lua",
    "base/Startup.lua",
    "GUI/guiconstructors.lua"
)

$moduleIncludes = @{
    auralogger             = @("modules/extra/auralogger.lua")
    spelllogger            = @("modules/extra/spelllogger.lua")
    autokeyinserter        = @("modules/extra/autokeyinserter.lua")
    autocompleteslmissions = @("modules/extra/autocompleteslmissions.lua")
    pullbuttons            = @("modules/extra/pullbuttons.lua")
    autovendor             = @("modules/vendor/autovendor.lua")
    autorepair             = @("modules/vendor/autorepair.lua")
}

function AddFile([string]$file) {
    $child = $embeds.CreateElement($scriptTag)
    [void]$child.SetAttribute($fileAttrib, $file)
    [void]$ui.AppendChild($child)
}

function CreateOutputFile([string]$file) {
    $dest = "$($output)/$($file)"
    New-Item $dest -Force
    Copy-Item "src/$($file)" $dest -Force
}

If ((Test-Path $output)) {
    Remove-Item -Recurse -Force $output
}

New-Item -ItemType Directory -Force -Path $output

foreach ($item in $libIncludes) {
    AddFile $item
    CreateOutputFile $item
}

foreach ($item in $mediaIncludes) {
    CreateOutputFile $item
}

foreach ($item in $baseIncludes) {
    AddFile $item
    CreateOutputFile $item
}

if ($allModules) {
    foreach ($module in $moduleIncludes) {
        foreach ($item in $module.Values) {
            AddFile $item
            CreateOutputFile $item
        }
    }
}
else {
    foreach ($module in $modules) {
        foreach ($item in $moduleIncludes[$module]) {
            AddFile $item
            CreateOutputFile $item
        }
    }
}

CreateOutputFile "Blade.toc"

$embeds.Save("$($output)/embeds.xml")
