/*
Require $if: "v4"
if you use v5
*/

$if[$toLowercase[$message[1]]==write]
$attachment[https://api.qrserver.com/v1/create-qr-code/?size=960x960&data=$uri[encode;$messageSlice[1]];unknown.jpeg]
$onlyIf[$checkContains[$messageSlice[1];"]!=true;Something just happened]
$onlyIf[$messageSlice[1]!=;Any text?]
$elseIf[$toLowercase[$message[1]]==read]
$splitText[12]
$onlyIf[$splitText[12]!=error;Unknown file]
$textSplit[$jsonRequest[http://api.qrserver.com/v1/read-qr-code/?fileurl=$message[2];;Something just happened];"]
$onlyIf[$isValidLink[$message[2]]!=false;Must link]
$onlyIf[$message[2]!=;Please put image link]
$endelseif
$endif
$argsCheck[>1;Usage: \`qrcode <write/read>\`]
