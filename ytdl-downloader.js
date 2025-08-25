module.exports = [{
name: "yt-d",
type: "messageCreate",
code: `
$reply[$channelID;$messageID;true]
$onlyIf[$message[0]!=;Usage: \`yt-d <youtube_url>\`]
$onlyIf[$isValidLink[$message[0]];Invalid link.]
$onlyIf[$checkContains[$message[0];youtube.com;youtu.be];Invalid link.]
$let[url;$replace[$message[0];
;]]
$let[videoid;$djsEval[((ctx.getKeyword("url").match(new RegExp('(?:\\[?&\\]v(?:i)?=|(?:youtu\\.be|v|vi|u\\/\\w|embed|shorts|watch|live|source)\\/)(\\[A-Za-z0-9_-\\]{11})(?=$|\\[?#&\\/\\])'))||\\[\\])\\[1\\])||'']]
$onlyIf[$get[videoid]!=;No VideoID.]

$let[mid;$sendMessage[$channelID;
$thumbnail[https://i.ytimg.com/vi_webp/$get[videoid]/sddefault.webp]
$color[a09fff]
$addActionRow
$addStringSelectMenu[formatytselector_$authorID;Loading;true;1;1]
$addOption[null;;null]
;true]]

$try[
$httpSetBody[{"context":{"client":{"clientName":"ANDROID_VR","clientVersion":"1.10.0"}}}]
$httpAddHeader[Accept-Encoding;gzip]
$!httpRequest[https://www.youtube.com/youtubei/v1/player?prettyPrint=false&fields=responseContext.visitorData;POST]
$httpSetBody[{"videoId":"$get[videoid]","context":{"client":{"hl":"en-US","gl":"US","clientName":"ANDROID_VR","clientVersion":"1.10.0","visitorData":"$httpResult[responseContext;visitorData]","clientScreen":"WATCH","clientFormFactor":"UNKNOWN_FORM_FACTOR"},"request":{"useSsl":true,"internalExperimentFlags":\\[\\],"consistencyTokenJars":\\[\\]}},"playbackContext":{"contentPlaybackContext":{"vis":0,"splay":true,"html5Preference":"HTML5_PREF_WANTS","lactMilliseconds":"-1"}},"attestationRequest":{"omitBotguardData":true},"racyCheckOk":true,"contentCheckOk":true}]
$httpAddHeader[Accept-Encoding;gzip]
$let[httpstatus;$httpRequest[https://www.youtube.com/youtubei/v1/player?prettyPrint=false&fields=videoDetails,playabilityStatus,streamingData(formats(url),adaptiveFormats(itag,contentLength,bitrate,mimeType,audioQuality,audioTrack,isDrc));POST;reshttp]]
$onlyIf[$get[httpstatus]==200;$!editMessage[$channelID;$get[mid];Can't process this.\nError: $get[httpstatus]]]
$onlyIf[$env[reshttp;playabilityStatus;status]==OK;$!editMessage[$channelID;$get[mid];Can't process this.\nError: \`$env[reshttp;playabilityStatus;reason]\`]]
$onlyIf[$or[$env[reshttp;videoDetails;lengthSeconds]==0;$env[reshttp;videoDetails;isLiveContent]]!=true;$!editMessage[$channelID;$get[mid];Can't process this.]]
;
$onlyIf[$env[errorhttp]!=;]
$sendMessage[$channelID;Can't process this.\nError: ($get[httpstatus]) | $env[errorhttp]]
$stop
;errorhttp]
$jsonLoad[aa;$env[reshttp;streamingData;adaptiveFormats]]
$jsonLoad[filter_aa;$arrayMap[aa;ab;$if[$and[$jsonHas[ab;isDrc]==false;$jsonHas[ab;audioQuality];$or[$jsonHas[ab;audioTrack]==false;$checkContains[$env[ab;audioTrack;displayName];original]]];$return[$env[ab]]]]]
$arrayReverse[filter_aa;filter_aa]
$!editMessage[$channelID;$get[mid];
$author[$env[reshttp;videoDetails;author];;https://www.youtube.com/channel/$env[reshttp;videoDetails;channelId]]
$title[$env[reshttp;videoDetails;title];https://www.youtube.com/watch?v=$get[videoid]]
$addField[Type;\`$if[$checkContains[$env[reshttp;streamingData;formats;0;url];&gcr=];Youtube Music;Youtube]\`;false]
$addField[Duration;\`$parseDigital[$multi[$env[reshttp;videoDetails;lengthSeconds];1000]]\`;true]
$addField[Views;\`$separateNumber[$env[reshttp;videoDetails;viewCount]]\`;true]
$thumbnail[https://i.ytimg.com/vi_webp/$get[videoid]/sddefault.webp]
$color[a09fff]

$addActionRow
$addStringSelectMenu[formatytselector_$authorID;$arrayLength[filter_aa] Formats Available;false;1;1]
$arrayForEach[filter_aa;res_aa;
$addOption[$round[$divide[$env[res_aa;bitrate];1000];0]Kbps - $round[$divide[$env[res_aa;contentLength];1024;1024];3]MB;($env[res_aa;itag]) | .$if[$checkContains[$env[res_aa;mimeType];opus];opus;m4a];$env[res_aa;itag]_"$get[videoid]"]
]]
`
},
{
type: "interactionCreate",
allowedInteractionTypes: ["selectMenu"],
code: `
$onlyIf[$advancedTextSplit[$customID;_;0]==formatytselector]
$onlyIf[$advancedTextSplit[$customID;_;1]==$authorID]

$interactionUpdate[Testing URL.]

$let[itag;$advancedTextSplit[$selectMenuValues[0];_;0]]
$let[videoid;$advancedTextSplit[$selectMenuValues[0];";1]]

$localFunction[syncprocessaudio;
$try[
$httpSetBody[{"context":{"client":{"clientName":"ANDROID_VR","clientVersion":"1.10.0"}}}]
$httpAddHeader[Accept-Encoding;gzip]
$!httpRequest[https://www.youtube.com/youtubei/v1/player?prettyPrint=false&fields=responseContext.visitorData;POST]
$httpSetBody[{"videoId":"$get[videoid]","context":{"client":{"hl":"en-US","gl":"US","clientName":"ANDROID_VR","clientVersion":"1.10.0","visitorData":"$httpResult[responseContext;visitorData]","clientScreen":"WATCH","clientFormFactor":"UNKNOWN_FORM_FACTOR"},"request":{"useSsl":true,"internalExperimentFlags":\\[\\],"consistencyTokenJars":\\[\\]}},"playbackContext":{"contentPlaybackContext":{"vis":0,"splay":true,"html5Preference":"HTML5_PREF_WANTS","lactMilliseconds":"-1"}},"attestationRequest":{"omitBotguardData":true},"racyCheckOk":true,"contentCheckOk":true}]
$httpAddHeader[Accept-Encoding;gzip]
$let[httpstatus;$httpRequest[https://www.youtube.com/youtubei/v1/player?prettyPrint=false&fields=videoDetails,playabilityStatus,streamingData(adaptiveFormats(itag,url,contentLength,mimeType,audioQuality,audioTrack,isDrc));POST;reshttp]]
$onlyIf[$get[httpstatus]==200;Can't process this.\nError: $get[httpstatus]]
$onlyIf[$env[reshttp;playabilityStatus;status]==OK;Can't process this.\nError: \`$env[reshttp;playabilityStatus;reason]\`]
$onlyIf[$env[reshttp;videoDetails;lengthSeconds]!=0;Can't process this.]
;
$onlyIf[$env[errorhttp]!=;]
$interactionReply[Can't process this.\nError: ($get[httpstatus]) | $env[errorhttp]]
$stop
;errorhttp]

$jsonLoad[aa;$env[reshttp;streamingData;adaptiveFormats]]
$jsonLoad[filter_aa;$arrayMap[aa;ab;$if[$and[$jsonHas[ab;isDrc]==false;$jsonHas[ab;audioQuality];$or[$jsonHas[ab;audioTrack]==false;$checkContains[$env[ab;audioTrack;displayName];original]]];$return[$if[$checkContains[$env[ab;url];&ratebypass];$env[ab];$replace[$env[ab];&requiressl=yes;&requiressl=yes&ratebypass=true&range=0-$if[$env[ab;contentLength]>=10000000;10000000;$env[ab;contentLength]];1]]]]]]
$jsonLoad[specific_aa;$arrayMap[filter_aa;filter_ab;$if[$env[filter_ab;itag]==$get[itag];$return[$env[filter_ab]]]]]
$onlyIf[$env[specific_aa;0;url]!=;$interactionReply[Can't download this.]]

$onlyIf[$httpRequest[$env[specific_aa;0;url];HEAD]==200;$if[$env[doesretry]==true;$callLocalFunction[syncprocessaudio;false];$interactionReply[Can't download this.]]]
$interactionReply[Downloading.\n-# This may taking while.$if[$env[specific_aa;0;contentLength]>=10000000;\n-# File Size will be limit to ~10MB if it's exceeded.]]
$interactionReply[$attachment[$env[specific_aa;0;url];$env[reshttp;videoDetails;title].$if[$checkContains[$env[specific_aa;0;mimeType];opus];opus;m4a]]]
;doesretry]
$callLocalFunction[syncprocessaudio;true]
`
}]
