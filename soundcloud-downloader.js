$editMessage[$get[secondidmessage];
\`\`\`js
Title: $advancedTextSplit[$get[link];,"title":";2;";1]$replaceText[$replaceText[$checkContains[$get[after];preview];true; | Preview Version];false;]
Artist: $advancedTextSplit[$get[link];"username":";2;";1]
Genre: $advancedTextSplit[$get[link];"genre":";2;";1]
Bitrate: 128 Kbps
Duration: $replaceText[$replaceText[$checkContains[$get[after];preview];true;00:00:30\nOriginal Duration: $djsEval[new Date($advancedTextSplit[$get[link];"full_duration":;2;,;1]).toISOString().substr(11, 8);yes]];false;$djsEval[new Date($advancedTextSplit[$get[link];"full_duration":;2;,;1]).toISOString().substr(11, 8);yes]]
\`\`\`]
$deleteMessage[$get[idmessage]]
$let[secondidmessage;$sendMessage[{attachment:$advancedTextSplit[$get[link];,"title":";2;";1].mp3:$get[linkdownload]};yes]]
$editMessage[$get[idmessage];Uploading..]
$let[linkdownload;$get[after]]
$let[after;$jsonRequest[$advancedTextSplit[$get[link];{"url":;3;";2]?client_id=$get[clientid];url]]
$onlyIf[$checkContains[$advancedTextSplit[$get[link];"quality":"sq"},{"url":";2;";1];hls]==false;Failed processing file.
> \`invalid property 'hls'\`]
$onlyIf[$botPing<=30000;Failed processing file.
> \`network not established\`]
$if[$checkContains[$message[1];https://soundcloud.app.goo.gl/]==true]
$let[link;$httpRequest[$get[extract]]]
$let[extract;$advancedTextSplit[$httpRequest[$message[1]];<link rel="canonical" href=";2;";1]]
$else
$let[link;$httpRequest[$message[1]]]
$endif
$let[idmessage;$sendMessage[Processing..;yes]]
$onlyIf[$isValidLink[$message[1]]!=false;Something just happened.]
$onlyIf[$checkContains[$message[1];https://soundcloud.com/;https://soundcloud.app.goo.gl/]!=false;Not support.]
$argsCheck[1;SoundCloud URL?]
$onlyBotPerms[attachfiles;Missing Permission, **Attach Files** - Bot]
$let[clientid;<your clientid here>]
