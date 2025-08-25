module.exports = [{
    name: "steal",
    type: "messageCreate",
    code: `
    $reply[$channelID;$messageID;true]
    $onlyIf[$hasPerms[$guildID;$authorID;ManageGuild];Missing Permission, **Manage Server** - <@$authorID>]
    $onlyIf[$hasPerms[$guildID;$clientID;ManageGuildExpressions;ManageEmojisAndStickers];Missing Permission, **Manage Expressions** - <@$clientID>]
    $onlyIf[$or[$messageReferenceID!=;$message[0]!=;$messageSticker!=];Usage: \`steal <emoji/sticker>\`]
    $let[mid;$if[$messageReferenceID==;$messageID;$messageReferenceID]]
    $let[content;$djsEval[ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(a => a.content).catch()]]
    $let[emojis;$advancedTextSplit[$get[content];<;1;>;0]]
    $onlyIf[$or[$get[emojis]!=;$messageSticker[$channelID;$get[mid];0]!=];Nothing to steal.]
    $if[$get[emojis]!=;

    $let[isgif;$checkCondition[$advancedTextSplit[$get[emojis];:;0]==a]]
    $let[name;$advancedTextSplit[$get[emojis];:;1]]
    $let[eid;$advancedTextSplit[$get[emojis];:;2]]

    $let[return;https://cdn.discordapp.com/emojis/$get[eid].$if[$get[isgif];gif;png]?size=2048&name=$encodeURI[$get[name]]]
    ;
    $if[$messageSticker[$channelID;$get[mid];0]!=;

    $let[eid;$djsEval[ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(a => a.stickers.map(b => b.id)\\[0\\])]]
    $let[return;$messageStickers[$channelID;$get[mid]]?size=2048&name=$encodeURI[$stickerName[$get[eid]]]]
    ]]
    $description[Choose what to steal:]
    $color[FFFFFF]
    $image[$get[return]]
    $addActionRow
    $addButton[stealasset_emoji_$authorID;Steal as Emoji;Primary]
    $addButton[stealasset_sticker_$authorID;Steal as Sticker;Success]
    `
},
{
    type: "interactionCreate",
    code: `$onlyIf[$advancedTextSplit[$customID;_;0]==stealasset;]
    $onlyIf[$advancedTextSplit[$customID;_;2]==$authorID;]

    $ephemeral
    $defer

    $!disableComponentsOf[$channelID;$messageID]

    $let[image;$getEmbeds[$channelID;$messageID;0;image]]
    $let[eid;$advancedTextSplit[$get[image];/;$charCount[$get[image];/];.;0]]

    $if[$advancedTextSplit[$customID;_;1]==emoji;
    
    $onlyIf[$or[$sum[$guildEmojiCount[$guildID;normal];1]<=$divide[$guildEmojiLimit[$guildID];2];$sum[$guildEmojiCount[$guildID;animated];1]<=$divide[$guildEmojiLimit[$guildID];2]];I can't add emojis anymore. Please remove one of them.]
    $let[name;$replace[$decodeURI[$advancedTextSplit[$get[image];&name=;1]]; ;]]
    $let[return;$addEmoji[$guildID;$get[name];$get[image];true]]
    ;
    $if[$advancedTextSplit[$customID;_;1]==sticker;

    $onlyIf[$sum[$argCount[$guildStickerIDs[$guildID]];1]<=$guildStickerLimit[$guildID];I can't add sticker anymore. Please remove one of them.]
    $let[exist;$checkCondition[$httpRequest[https://cdn.discordapp.com/stickers/$get[eid].png;HEAD]==200]]
    $let[url;$if[$get[exist];$stickerURL[$get[eid]];$get[image]]]
    $let[name;$if[$get[exist];$stickerName[$get[eid]];$decodeURI[$advancedTextSplit[$get[image];&name=;1]]]]
    $let[tags;$if[$get[exist];$stickerTags[$get[eid]];$decodeURI[$advancedTextSplit[$get[image];&name=;1]]]]
    $let[description;$if[$get[exist];$stickerDescription[$get[eid]]]]

    $let[return;$addSticker[$guildID;$get[url];$get[name];$get[tags];$get[description]]]
    ]]
    $!interactionFollowUp[$if[$get[return]==;Failed to steal.;Successfully steal!\nID: $get[return]]]
    `
}]
