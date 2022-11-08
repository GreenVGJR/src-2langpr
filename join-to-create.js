/*
List Commands:
- v.create | Create Join-to-Create
- v.options | List Options
- v.reset | Reset Join-to-Create

- v.lock
- v.unlock
- v.claim
- v.add
- v.remove
_______________
Require Permissions:
 View Channel, Manage Channels, Move Members, Connect, Speak, Stream
_______________
Default Permissions while Creating Voice:
 User: +managechannel, +connect, +speak, +stream, +viewchannel
 Bot: +managechannel, +movemembers
 Everyone: /managechannel, /connect, /speak, /stream

+ Active
- Deactive
/ Following Default Permission
*/
/*
 Variables:

 voicecreateid: "",
 voicechannelid: "",
 voicecategoryid: "",
 voicecreatename: "(name)", //available (id), (name), (discriminator), (timestamp)
 voicecustomuser: "",
 voiceonly: "1",
 voicetimedelete: "0", //milisecond
 voiceactive: "false"

 Callbacks:

 bot.onMessage()
 bot.onInteractionCreate()
 bot.onVoiceStateUpdate()
 bot.onChannelDelete()
*/

module.exports = [{
 name: "joincreate",
 type: "voiceStateUpdate",
 $if: "v4",
 channel: "$getServerVar[voicecreateid]",
 code: `$if[$voiceID[$newState[id]]==$getServerVar[voicecreateid]]
$if[$getUserVar[voicechannelid;$newState[id]]!=]
$moveUser[$guildID;$newState[id];$getUserVar[voicechannelid;$newState[id]]]
$else
$moveUser[$guildID;$newState[id];$get[voiceid]]
$modifyChannelPerms[$guildID;$get[voiceid];/managechannel;/connect;/speak;/stream]
$modifyChannelPerms[$newState[id];$get[voiceid];+managechannel;+connect;+speak;+stream;+viewchannel]
$modifyChannelPerms[$clientID;$get[voiceid];+managechannel;+movemembers]
$setUserVar[voicechannelid;$get[voiceid];$newState[id]]
$setChannelVar[voicecategoryid;$channelCategoryID[$get[voiceid]];$get[voiceid]]
$setChannelVar[voicechannelid;$get[voiceid]-$newState[id];$get[voiceid]]
$let[voiceid;$cloneChannel[$voiceID[$newState[id]];$replaceText[$replaceText[$replaceText[$replaceText[$getServerVar[voicecreatename];(name);$cropText[$username[$newState[id]];8]];(id);$cropText[$newState[id];10]];(discriminator);$discriminator[$newState[id]]];(timestamp);$cropText[$dateStamp;10]]-voice;yes]]
$onlyIf[$channelType[$getServerVar[voicecreateid]]==voice;]
$onlyIf[$isBot[$replaceText[$replaceText[$checkCondition[$newState[id]==];true;$oldState[id]];false;$newState[id]]]!=true;]
$endif
$else
$if[$getServerVar[voicetimedelete]<1000]
$setUserVar[voicechannelid;;$advancedTextSplit[$getChannelVar[voicechannelid;$oldState[channelId]];-;2]]
$deleteChannel[$advancedTextSplit[$getChannelVar[voicechannelid;$oldState[channelId]];-;1]]
$else
$deleteChannel[$get[channel]]
$onlyIf[$channelExists[$get[channel]]!=false;]
$wait[$getServerVar[voicetimedelete]]
$setUserVar[voicechannelid;;$advancedTextSplit[$getChannelVar[voicechannelid;$oldState[channelId]];-;2]]
$let[channel;$getUserVar[voicechannelid;$advancedTextSplit[$getChannelVar[voicechannelid;$oldState[channelId]];-;2]]]
$endif
$if[$getServerVar[voiceonly]==1]
$onlyIf[$usersInChannel[$replaceText[$replaceText[$checkCondition[$get[voiceid]==];true;$getServerVar[voicechannelid]];false;$get[voiceid]]]==;]
$let[voiceid;$replaceText[$replaceText[$checkCondition[$advancedTextSplit[$getChannelVar[voicechannelid;$oldState[channelId]];-;2]==$newState[id]];true;$advancedTextSplit[$getChannelVar[voicechannelid;$getUserVar[voicechannelid;$replaceText[$replaceText[$checkCondition[$newState[id]==];true;$oldState[id]];false;$newState[id]]]];-;1]];false;$advancedTextSplit[$getChannelVar[voicechannelid;$replaceText[$replaceText[$checkCondition[$newState[channelId]==];true;$oldState[channelId]];false;$newState[channelId]]];-;1]]]
$onlyIf[$voiceID[$newState[id]]!=$advancedTextSplit[$getChannelVar[voicechannelid;$replaceText[$replaceText[$checkCondition[$newState[channelId]==];true;$oldState[channelId]];false;$newState[channelId]]];-;1];]
$else
$onlyIf[$checkContains[$getChannelVar[voicechannelid;$replaceText[$replaceText[$checkCondition[$newState[channelId]==];true;$oldState[channelId]];false;$newState[channelId]]];$newState[id]]!=false;]
$endif
$onlyIf[$getChannelVar[voicecategoryid;$replaceText[$replaceText[$checkCondition[$newState[channelId]==];true;$oldState[channelId]];false;$replaceText[$replaceText[$checkCondition[$voiceID[$newState[id]]==];true;$oldState[channelId]];false;$getUserVar[voicechannelid;$newState[id]]]]]==$channelCategoryID[$getServerVar[voicecreateid]];]
$endif
$onlyIf[$getServerVar[voiceactive]!=false;]
$suppressErrors`
},
 {
 name: "resetuser",
 type: "channelDelete",
 channel: "$getServerVar[voicecreateid]",
 code: `$setUserVar[voicechannelid;;$advancedTextSplit[$get[id];-;2]]
$onlyIf[$get[id]!=;]
$let[id;$getChannelVar[voicechannelid;$oldChannel[id]]]
$onlyIf[$getServerVar[voiceactive]!=false;]`
},
 {
 name: "v.create",
 code: `$reply[$messageID;no]
$setServerVar[voiceactive;true]
$setServerVar[voicecreateid;$findNumbers[$message[1]]]
$replaceText[$replaceText[$getServerVar[voiceactive];false;Activated Join-to-Create for];true;Updated Join-to-Create to] <#$findNumbers[$message[1]]>.
$onlyIf[$hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;managechannel;connect;speak;stream;movemembers]!=false;Missing some Permissions - Category (<@$clientID>)
\`\`\`
$replaceText[$replaceText[
Manage Channels : $hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;managechannel]
Connect         : $hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;connect]
Speak           : $hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;speak]
Stream          : $hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;stream]
Move Members    : $hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientID;movemembers];false;❌];true;✅] 
\`\`\`
]
$onlyIf[$hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$guildID;viewchannel]!=false;Category Locked | Public]
$onlyIf[$hasPermsInChannel[$channelCategoryID[$findNumbers[$message[1]]];$clientiD;viewchannel]!=false;Category Locked | <@$clientID>]
$onlyIf[$channelCategoryID[$findNumbers[$message[1]]]!=;Category not found on <#$findNumbers[$message[1]]>]
$onlyIf[$channelType[$findNumbers[$message[1]]]==voice;Channel not valid \`'voice'\`]
$onlyIf[$hasPermsInChannel[$findNumbers[$message[1]];$guildID;viewchannel]!=false;Channel Locked | Public]
$onlyIf[$hasPermsInChannel[$findNumbers[$message[1]];$clientiD;viewchannel]!=false;Channel Locked | <@$clientID>]
$onlyIf[$channelExists[$findNumbers[$message[1]]]==true;Channel not exist]
$argsCheck[>0;Usage: \`v.create <voice channel id>\`]
$onlyBotPerms[stream;Missing Permission, **Stream** - Bot]
$onlyBotPerms[speak;Missing Permission, **Speak** - Bot]
$onlyBotPerms[connect;Missing Permission, **Connect** - Bot]
$onlyBotPerms[movemembers;Missing Permission, **Move Members** - Bot]
$onlyBotPerms[viewchannel;Missing Permission, **View Channels** - Bot]
$onlyBotPerms[managechannel;Missing Permission, **Manage Channels** - Bot]
$onlyPerms[manageserver;Missing Permission, **Manage Server** - User]`
},
 {
 name: "v.reset",
 code: `$reply[$messageID;no]
Reseted Join-to-Create.
$setServerVar[voiceactive;false]
$setServerVar[voicecreateid;]
$onlyIf[$getServerVar[voicecreateid]!=;Already reset]
$onlyPerms[manageserver;Missing Permission, **Manage Server** - User]`
},
 {
 name: "v.add",
 code: `Added \`$userTag[$findNumbers[$message[1]]]\` to <#$voiceID[$authorID]>.
$setChannelVar[voicecustomuser;$getChannelVar[voicecustomuser;$voiceID[$authorID]]\n$findNumbers[$message[1]];$voiceID[$authorID]]
$modifyChannelPerms[$findNumbers[$message[1]];$voiceID[$authorID];+connect;+speak;+stream;+viewchannel]
$onlyIf[$checkContains[$getChannelVar[voicecustomuser;$voiceID[$authorID]];$findNumbers[$message[1]]]==false;Already added]
$onlyIf[$hasPermsInChannel[$voiceID[$authorID];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - <#$voiceID[$authorID]> (<@$clientID>)]
$onlyIf[$hasPermsInChannel[$channelCategoryID[$voiceID[$authorID]];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - Category (<@$clientID>)]
$onlyIf[$findNumbers[$message[1]]!=$authorID;You cant add yourself.]
$onlyIf[$memberExists[$findNumbers[$message[1]]]!=false;User not exist.]
$argsCheck[>0;Usage: \`v.add <userid/mention>\`]
$onlyIf[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]==$authorID;You're not own this channel.]
$onlyIf[$getChannelVar[voicecategoryid;$voiceID[$authorID]]==$channelCategoryID[$getServerVar[voicecreateid]];]
$onlyIf[$getChannelVar[voicechannelid;$voiceID[$authorID]]!=;]
$onlyIf[$voiceID[$authorID]!=;]
$onlyIf[$getServerVar[voiceactive]!=false;]`
},
{
 name: "v.remove",
 code: `Removed \`$userTag[$findNumbers[$message[1]]]\` from <#$voiceID[$authorID]>.
$setChannelVar[voicecustomuser;$replaceText[$getChannelVar[voicecustomuser;$voiceID[$authorID]];$findNumbers[$message[1]];;1];$voiceID[$authorID]]
$modifyChannelPerms[$findNumbers[$message[1]];$voiceID[$authorID];/connect;/speak;/stream;/viewchannel]
$onlyIf[$checkContains[$getChannelVar[voicecustomuser;$voiceID[$authorID]];$findNumbers[$message[1]]]==true;Already removed]
$onlyIf[$hasPermsInChannel[$voiceID[$authorID];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - <#$voiceID[$authorID]> (<@$clientID>)]
$onlyIf[$hasPermsInChannel[$channelCategoryID[$voiceID[$authorID]];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - Category (<@$clientID>)]
$onlyIf[$findNumbers[$message[1]]!=$authorID;You cant remove yourself.]
$onlyIf[$memberExists[$findNumbers[$message[1]]]!=false;User not exist.]
$argsCheck[>0;Usage: \`v.remove <userid/mention>\`]
$onlyIf[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]==$authorID;You're not own this channel.]
$onlyIf[$getChannelVar[voicecategoryid;$voiceID[$authorID]]==$channelCategoryID[$getServerVar[voicecreateid]];]
$onlyIf[$getChannelVar[voicechannelid;$voiceID[$authorID]]!=;]
$onlyIf[$voiceID[$authorID]!=;]
$onlyIf[$getServerVar[voiceactive]!=false;]`
},
{
 name: "v.claim",
 code: `You claim <#$voiceID[$authorID]> as your now.
$setUserVar[voicechannelid;$voiceID[$authorID]]
$setUserVar[voicechannelid;;$get[cache]]
$setChannelVar[voicechannelid;$voiceID[$authorID]-$authorID;$voiceID[$authorID]]
$let[cache;$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]]]
$onlyIf[$advancedTextSplit[$usersInChannel[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;1]];,;2]==;You cant claim this channel while everyone on voice.]
$onlyIf[$checkContains[$usersInChannel[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;1]];$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]]==false;$replaceText[$replaceText[$checkCondition[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]==$authorID];true;You owned this channel.];false;You cant claim this channel while owner on voice.]]
$onlyIf[$getChannelVar[voicecategoryid;$voiceID[$authorID]]==$channelCategoryID[$getServerVar[voicecreateid]];]
$onlyIf[$getChannelVar[voicechannelid;$voiceID[$authorID]]!=;]
$onlyIf[$voiceID[$authorID]!=;]
$onlyIf[$getServerVar[voiceactive]!=false;]`
},
 {
 name: "v.lock",
 aliases: ["v.unlock"],
 $if: "v4",
 code: `$if[$hasPermsInChannel[$voiceID[$authorID];$guildID;connect]==false]
$sendMessage[Channel Unlocked.;no]
$modifyChannelPerms[$guildID;$voiceID[$authorID];/connect]
$else
$sendMessage[Channel Locked.;no]
$modifyChannelPerms[$guildID;$voiceID[$authorID];-connect]
$endif
$onlyIf[$hasPermsInChannel[$voiceID[$authorID];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - <#$voiceID[$authorID]> (<@$clientID>)]
$onlyIf[$hasPermsInChannel[$channelCategoryID[$voiceID[$authorID]];$clientID;managechannel]!=false;Missing Permision, **Manage Channels** - Category (<@$clientID>)]
$onlyIf[$advancedTextSplit[$getChannelVar[voicechannelid;$voiceID[$authorID]];-;2]==$authorID;You're not own this channel.]
$onlyIf[$getChannelVar[voicecategoryid;$voiceID[$authorID]]==$channelCategoryID[$getServerVar[voicecreateid]];]
$onlyIf[$getChannelVar[voicechannelid;$voiceID[$authorID]]!=;]
$onlyIf[$voiceID[$authorID]!=;]
$onlyIf[$getServerVar[voiceactive]!=false;]`
},
 {
 name: "v.options",
 aliases: ["v.option"],
 $if: "v4",
 code: `$reply[$messageID;no]
$addField[1;Type;\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`;yes]
$addField[1;Channel;$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>];yes]
$addField[1;Status;\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`;yes]
$color[1;a09fff]
$addField[2;Time Delete;\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`;yes]
$addField[2;When Delete;\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Author Left];1;Everyone Left]\`;yes]
$color[2;a09fff]
$addTimestamp[2]
$if[$getServerVar[voicecreateid]!=]
$addSelectMenu[1;voiceoptionjtc;Options;1;1;no;Delete:When & Time Delete:customizevoice_$authorID:no;Type Create:Name, Discriminator, ID, Timestamp:typevoice_$authorID:no;Status:Disable/Enable JTC:jtcvoice_$authorID_false-true-$getServerVar[voiceactive]:no]
$endif
$onlyPerms[manageserver;Missing Permission, **Manage Server** - User]`
},
 {
 name: "voiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 code: `$interactionUpdate[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Author Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}};{actionRow:{selectMenu:voiceoptionjtc:When Delete:1:1:no:{selectMenuOptions:Owner Left:deletevoice_$interactionData[author.id]_0:Voice will Deleted when Owner Left.} {selectMenuOptions:Everyone Left:deletevoice_$interactionData[author.id]_1:Voice will Deleted when Everyone Left.}}} {actionRow:{selectMenu:timevoiceoptionjtc:Time Delete:1:1:no:{selectMenuOptions:0s:timedeletevoice_$interactionData[author.id]_0:0 Second} {selectMenuOptions:5s:timedeletevoice_$interactionData[author.id]_5000:5 Seconds} {selectMenuOptions:10s:timedeletevoice_$interactionData[author.id]_10000:10 Second} {selectMenuOptions:20s:timedeletevoice_$interactionData[author.id]_20000:20 Second} {selectMenuOptions:30s:timedeletevoice_$interactionData[author.id]_30000:30 Seconds} {selectMenuOptions:45s:timedeletevoice_$interactionData[author.id]_45000:45 Seconds} {selectMenuOptions:1m:timedeletevoice_$interactionData[author.id]_60000:1 Minute}}}]
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==customizevoice;]`
},
 {
 name: "voiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 code: `$interactionUpdate[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Author Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}};{actionRow:{selectMenu:typevoiceoptionjtc:Type Create:1:1:no:{selectMenuOptions:Name:typevoice_$authorID_(name):$cropText[$username[$interactionData[author.id]];5]-Voice} {selectMenuOptions:ID:typevoice_$authorID_(id):$cropText[$interactionData[author.id];10]-Voice} {selectMenuOptions:Discriminator:typevoice_$authorID_(discriminator):$discriminator[$interactionData[author.id]]-Voice} {selectMenuOptions:Timestamp:typevoice_$authorID_(timestamp):$cropText[$dateStamp;10]-Voice}}}]
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==typevoice;]`
},
{
 name: "voiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 $if: "v4",
 code: `$deleteMessage[$interactionData[message.id]]
$if[$getServerVar[voicecreateid]==]
$interactionFollowUp[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Owner Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}}]
$else
$interactionFollowUp[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Owner Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}};{actionRow:{selectMenu:voiceoptionjtc:Options:1:1:no:{selectMenuOptions:Delete:customizevoice_$authorID:When & Time Delete:no} {selectMenuOptions:Type Create:typevoice_$authorID:Name, Discriminator, ID, Timestamp:no} {selectMenuOptions:Status:jtcvoice_$authorID_false-true-$getServerVar[voiceactive]:Disable/Enable JTC}}}]
$setServerVar[voiceactive;$replaceText[$replaceText[$checkCondition[$advancedTextSplit[$interactionData[values[0]];_;3;-;3]==$advancedTextSplit[$interactionData[values[0]];_;3;-;1]];true;$advancedTextSplit[$interactionData[values[0]];_;3;-;2]];false;$advancedTextSplit[$interactionData[values[0]];_;3;-;1]]]
$endif
$interactionDefer
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==jtcvoice;]`
},
{
 name: "typevoiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 $if: "v4",
 code: `$deleteMessage[$interactionData[message.id]]
$if[$getServerVar[voicecreateid]==]
$interactionFollowUp[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Owner Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}}]
$else
$interactionFollowUp[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Owner Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}};{actionRow:{selectMenu:typevoiceoptionjtc:Type Create:1:1:no:{selectMenuOptions:Name:typevoice_$authorID_(name):$cropText[$username[$interactionData[author.id]];5]-Voice} {selectMenuOptions:ID:typevoice_$authorID_(id):$cropText[$interactionData[author.id];10]-Voice} {selectMenuOptions:Discriminator:typevoice_$authorID_(discriminator):$discriminator[$interactionData[author.id]]-Voice} {selectMenuOptions:Timestamp:typevoice_$authorID_(timestamp):$cropText[$dateStamp;10]-Voice}}}]
$setServerVar[voicecreatename;$advancedTextSplit[$interactionData[values[0]];_;3]]
$endif
$interactionDefer
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==typevoice;]`
},
{
 name: "voiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 code: `$loop[1;{};voiceawaitedoption]
$setServerVar[voiceonly;$advancedTextSplit[$interactionData[values[0]];_;3]]
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==deletevoice;]`
},
{
 name: "timevoiceoptionjtc",
 type: "interaction",
 prototype: "selectMenu",
 code: `$loop[1;{};voiceawaitedoption]
$setServerVar[voicetimedelete;$advancedTextSplit[$interactionData[values[0]];_;3]]
$onlyIf[$hasPerms[$guildID;$interactionData[author.id];manageserver]!=false;]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;2]==$interactionData[author.id];]
$onlyIf[$advancedTextSplit[$interactionData[values[0]];_;1]==timedeletevoice;]`
},
 {
 name: "voiceawaitedoption",
 type: "awaited",
 code: `$interactionUpdate[;{newEmbed:{field:Status:\`$replaceText[$replaceText[$getServerVar[voiceactive];false;❌];true;✅]\`:yes} {field:Channel:$replaceText[$replaceText[$checkCondition[$getServerVar[voicecreateid]==];true;_ _];false;<#$getServerVar[voicecreateid]>]:yes} {field:Type:\`$replaceText[$replaceText[$getServerVar[voicecreatename];(;];);]\`:yes} {color:a09fff}} {newEmbed:{field:When Delete:\`$replaceText[$replaceText[$getServerVar[voiceonly];0;Owner Left];1;Everyone Left]\`:yes} {field:Time Delete:\`$replaceText[$replaceText[$checkCondition[$getServerVar[voicetimedelete]<1000];true;0s];false;$humanizeMS[$getServerVar[voicetimedelete];4]]\`:yes} {color:a09fff} {timestamp}};{actionRow:{selectMenu:voiceoptionjtc:When Delete:1:1:no:{selectMenuOptions:Owner Left:deletevoice_$interactionData[author.id]_0:Voice will Deleted when Owner Left.} {selectMenuOptions:Everyone Left:deletevoice_$interactionData[author.id]_1:Voice will Deleted when Everyone Left.}}} {actionRow:{selectMenu:timevoiceoptionjtc:Time Delete:1:1:no:{selectMenuOptions:0s:timedeletevoice_$interactionData[author.id]_0:0 Second} {selectMenuOptions:5s:timedeletevoice_$interactionData[author.id]_5000:5 Seconds} {selectMenuOptions:10s:timedeletevoice_$interactionData[author.id]_10000:10 Second} {selectMenuOptions:20s:timedeletevoice_$interactionData[author.id]_20000:20 Second} {selectMenuOptions:30s:timedeletevoice_$interactionData[author.id]_30000:30 Seconds} {selectMenuOptions:45s:timedeletevoice_$interactionData[author.id]_45000:45 Seconds} {selectMenuOptions:1m:timedeletevoice_$interactionData[author.id]_60000:1 Minute}}}]`
}]
