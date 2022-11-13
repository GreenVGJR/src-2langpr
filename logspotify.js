/*
variable:

logspotifychannel: ""
*/

module.exports = [{
 name: "spotify",
 type: "presenceUpdate",
 channel: "$getServerVar[logspotifychannel]",
 $if: "v4",
 code: `$if[$random[1;5]==4]
$editMessage[$get[id];{newEmbed:{footer:Cache Spotify} {author:$replaceText[$replaceText[$checkCondition[$get[cache]==];true;No data.];false;Reloaded.]} {color:fffffe}}]
$let[cache;$cacheMembers[$guildID]]
$let[id;$sendMessage[{newEmbed:{author:Refreshing..} {footer:Cache Spotify} {color:fffffe}};yes]]
$endif
$author[2;$getObjectProperty[assets.largeText]]
$thumbnail[2;https://i.scdn.co/image/$advancedTextSplit[$getObjectProperty[assets.largeImage];spotify:;2]]
$addField[2;URL;\`---Track\`\nhttps://open.spotify.com/track/$getObjectProperty[syncId]\n\n\`---Image\`\nhttps://i.scdn.co/image/$advancedTextSplit[$getObjectProperty[assets.largeImage];spotify:;2];yes]
$addField[2;Artist;$replaceText[$getObjectProperty[state];\\;;,];yes]
$addField[2;Title;$getObjectProperty[details]]
$color[2;a09fff]
$addTimestamp[2]
$author[1;Spotify]
$thumbnail[1;$userAvatar[$authorID;512]]
$addField[1;Author;<@!$authorID> (\`$userTag[$authorID]\`);yes]
$color[1;a09fff]
$createObject[$djsEval[JSON.stringify(guild.members.cache.get('$authorID').presence.activities.filter(x => x == 'Spotify')[0]);yes]]
$onlyIf[$djsEval[guild.members.cache.get('$authorID').presence.activities.filter(x => x == 'Spotify')[0];yes]!=undefined;]
$onlyIf[$isBot[$authorID]!=true;]
$onlyIf[$getServerVar[logspotifychannel]!=;]`
},
 {
 name: "logspotify",
 $if: "v4",
 code: `$if[$checkCondition[$getServerVar[logspotifychannel]==]-$checkCondition[$message[1]==]==false-true]
Disabled.
$setServerVar[logspotifychannel;]
$else
Log set in <#$findNumbers[$message]>.
$setServerVar[logspotifychannel;$findNumbers[$message]]
$onlyIf[$channelType[$findNumbers[$message]]==text;Channel not valid]
$onlyIf[$channelExists[$findNumbers[$message]]!=false;Channel not exist]
$onlyIf[$message[1]!=;Channel ID]
$endif
$onlyPerms[manageserver;Missing Permission, **Manage Server** - User]
$suppressErrors`
}]
