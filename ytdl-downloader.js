module.exports = [{
name: "yt-d",
type: "messageCreate",
code: `
$reply[$channelID;$messageID;true]
$onlyIf[$message[0]!=;Usage: \`yt-d <youtube_url>\`]
$onlyIf[$isValidLink[$message[0]];Invalid link.]
$onlyIf[$checkContains[$message[0];youtube.com;youtu.be];Invalid link.]
$let[videoid;$if[$advancedTextSplit[$message[0];watch;1;v=;1;&;0]!=;$advancedTextSplit[$message[0];watch;1;v=;1;&;0];$advancedTextSplit[$message[0];://;1;/;1;?;0]]]
$onlyIf[$get[videoid]!=;No VideoID.]
$let[appversion;20.23.37]

$startTyping[$channelID]

$try[
$httpSetBody[{"videoId":"$get[videoid]","context":{"client":{"hl":"en-US","gl":"US","clientName":"ANDROID","clientVersion":"$get[appversion]","clientScreen":"WATCH","clientFormFactor":"UNKNOWN_FORM_FACTOR"},"request":{"useSsl":true,"internalExperimentFlags":\\[\\],"consistencyTokenJars":\\[\\]}},"playbackContext":{"contentPlaybackContext":{"vis":0,"splay":false,"html5Preference":"HTML5_PREF_WANTS","lactMilliseconds":"-1","signatureTimestamp":0}},"attestationRequest":{"omitBotguardData":true},"racyCheckOk":true,"contentCheckOk":true}]
$let[httpstatus;$httpRequest[https://www.youtube.com/youtubei/v1/player;POST;reshttp]]
$onlyIf[$get[httpstatus]==200;Can't process this.\nError: $get[httpstatus]]
$onlyIf[$env[reshttp;playabilityStatus;status]==OK;Can't process this.\nError: \`$env[reshttp;playabilityStatus;reason]\`]
$onlyIf[$env[reshttp;videoDetails;lengthSeconds]!=0;Can't process this.]
;
$onlyIf[$env[errorhttp]!=;]
$sendMessage[$channelID;Can't process this.\nError: $env[errorhttp]]
$stop
;errorhttp]

$jsonLoad[aa;$env[reshttp;streamingData;adaptiveFormats]]
$jsonLoad[filter_aa;$arrayMap[aa;ab;$if[$and[$jsonHas[ab;isDrc]==false;$jsonHas[ab;audioQuality]];$return[$if[$checkContains[$env[ab;url];&ratebypass];$env[ab];$replace[$env[ab];&requiressl=yes;&requiressl=yes&ratebypass=true&range=0-$env[ab;contentLength];1]]]]]]
$arrayReverse[filter_aa;filter_aa]

$author[$env[reshttp;videoDetails;author]]
$title[$env[reshttp;videoDetails;title];https://www.youtube.com/watch?v=$get[videoid]]
$footer[$parseDigital[$multi[$env[reshttp;videoDetails;lengthSeconds];1000]]]
$thumbnail[https://i.ytimg.com/vi/$get[videoid]/sddefault.jpg]
$color[a09fff]

$addActionRow
$addStringSelectMenu[formatytselector_$authorID;$arrayLength[filter_aa] Formats Available;false;1;1]
$arrayForEach[filter_aa;res_aa;
$addOption[$round[$divide[$env[res_aa;bitrate];1000];0]Kbps - $round[$divide[$env[res_aa;contentLength];1024;1024];3]MB;($env[res_aa;itag]) | .$if[$checkContains[$env[res_aa;mimeType];opus];opus;m4a];$env[res_aa;itag]_"$get[videoid]"]
]
`
},
{
type: "interactionCreate",
allowedInteractionTypes: ["selectMenu"],
code: `
$onlyIf[$advancedTextSplit[$customID;_;0]==formatytselector]
$onlyIf[$advancedTextSplit[$customID;_;1]==$authorID]
$defer
$let[itag;$advancedTextSplit[$selectMenuValues[0];_;0]]
$let[videoid;$advancedTextSplit[$selectMenuValues[0];";1]]
$let[appversion;20.23.37]

$try[
$httpSetBody[{"videoId":"$get[videoid]","context":{"client":{"hl":"en-US","gl":"US","clientName":"ANDROID","clientVersion":"$get[appversion]","clientScreen":"WATCH","clientFormFactor":"UNKNOWN_FORM_FACTOR"},"request":{"useSsl":true,"internalExperimentFlags":\\[\\],"consistencyTokenJars":\\[\\]}},"playbackContext":{"contentPlaybackContext":{"vis":0,"splay":false,"html5Preference":"HTML5_PREF_WANTS","lactMilliseconds":"-1","signatureTimestamp":0}},"attestationRequest":{"omitBotguardData":true},"racyCheckOk":true,"contentCheckOk":true}]
$let[httpstatus;$httpRequest[https://www.youtube.com/youtubei/v1/player;POST;reshttp]]
$onlyIf[$get[httpstatus]==200;Can't process this.\nError: $get[httpstatus]]
$onlyIf[$env[reshttp;playabilityStatus;status]==OK;Can't process this.\nError: \`$env[reshttp;playabilityStatus;reason]\`]
$onlyIf[$env[reshttp;videoDetails;lengthSeconds]!=0;Can't process this.]
;
$onlyIf[$env[errorhttp]!=;]
$interactionReply[Can't process this.\nError: $env[errorhttp]]
$stop
;errorhttp]

$jsonLoad[aa;$env[reshttp;streamingData;adaptiveFormats]]
$jsonLoad[filter_aa;$arrayMap[aa;ab;$if[$and[$jsonHas[ab;isDrc]==false;$jsonHas[ab;audioQuality]];$return[$if[$checkContains[$env[ab;url];&ratebypass];$env[ab];$replace[$env[ab];&requiressl=yes;&requiressl=yes&ratebypass=true&range=0-$if[$env[ab;contentLength]>=10000000;10000000;$env[ab;contentLength]];1]]]]]]
$jsonLoad[specific_aa;$arrayMap[filter_aa;filter_ab;$if[$env[filter_ab;itag]==$get[itag];$return[$env[filter_ab]]]]]

$let[mid;$interactionReply[Downloading. (This may taking while)$if[$env[specific_aa;0;contentLength]>=10000000;\n-# File Size will be limit to ~10MB if it's exceeded.];true]]

$onlyIf[$httpRequest[$env[specific_aa;0;url];HEAD]==200;$!editMessage[$channelID;$get[mid];Can't download this.]]
$!editMessage[$channelID;$get[mid];$attachment[$env[specific_aa;0;url];$env[reshttp;videoDetails;title].$if[$checkContains[$env[specific_aa;0;mimeType];opus];opus;m4a]]]
`
}]
