$attachment[$replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_audio];$advancedtextsplit[$get[hls];"target_id";2;,;1;:;2; ;2]-audio.mp3]
$addField[HLS;
- $advancedtextsplit[$get[hls];data-hls-url=;2;";2]
- $advancedtextsplit[$get[hls];data-mpd-url=;2;";2];no]
$addField[Preview Image;- [Image 1]($advancedtextsplit[$get[hls];"twitter:image";2;";2])
- [Image 2]($advancedtextsplit[$get[hls];"og:image";2;";2]);no]
$addField[Preview Video;
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_64]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_96]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_144]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_240]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_360]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_480]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_540]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_640]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_720]
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_1080];no]
$addField[Preview Audio;
- $replaceText[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96;DASH_audio];no]
$addField[Data;Title: \`$advancedtextsplit[$get[hls];<head><title>;2;";1;<;1; : ;1]\`
Description: \`$advancedtextsplit[$get[hls];"og:description";2;";2]\`
Community: \`r/$advancedtextsplit[$get[hls];<head><title>;2;";1;<;1; : ;2]\`
Created: <t:$cropText[$advancedtextsplit[$get[hls];"loid_created";2;,;1;:;2; ;2];10]:F>
ID: \`$advancedtextsplit[$get[hls];"target_id";2;,;1;:;2; ;2]\`
Size: \`$truncate[$advancedtextsplit[$get[hls];data-video-width=;2;";2]]x$truncate[$advancedtextsplit[$get[hls];data-video-height=;2;";2]]\`
Position: \`$replaceText[$replaceText[$checkCondition[$truncate[$advancedtextsplit[$get[hls];data-video-width=;2;";2]]>=$truncate[$advancedtextsplit[$get[hls];data-video-height=;2;";2]]];true;$replaceText[$replaceText[$checkCondition[$truncate[$advancedtextsplit[$get[hls];data-video-width=;2;";2]]==$truncate[$advancedtextsplit[$get[hls];data-video-height=;2;";2]]];false;Landscape];true;Potrait]];false;Potret]\`

Over_18: \`$advancedtextsplit[$get[hls];"over_18";2;,;1;:;2; ;2]\`
Type: \`$advancedtextsplit[$get[hls];"target_url_domain";2;,;1;:;2; ;2;";2]\`
CUR: \`$advancedtextsplit[$get[hls];"cur_link";2;,;1;:;2; ;2;";2]\`
Onetrust: \`$advancedtextsplit[$get[hls];"use_onetrust";2;,;1;:;2; ;2]\`
;no]
$color[a09fff]
$addTimestamp
$onlyIf[$channelNSFW==$advancedtextsplit[$get[hls];"over_18";2;,;1;:;2; ;2];This video was nsfw, please use it on nsfw-only channel.]
$onlyIf[$checkContains[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];DASH_96]!=false;Unknown source]
$onlyIf[$checkContains[$advancedtextsplit[$get[hls];data-seek-preview-url=;2;";2];.mp4]!=false;Only support video]
$let[hls;$httpRequest[$message[1]]]
$onlyIf[$checkContains[$message[1];https://www.reddit.com/r/]!=false;Must from reddit]
$cooldown[10s;]
$argsCheck[1;Link video reddit?]
