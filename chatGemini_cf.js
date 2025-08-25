module.exports = {
name: "chatGemini",
params: [{
name: "prompt",
description: "Prompts to chat",
type: "String",
required: true
}],
code: `
$let[msg;$replace[$replace[$env[prompt];";\\\\\\\\\\\\"];
;\\n]]
$httpSetBody[f.req=%5Bnull%2C%22%5B%5B%5C%22$encodeURI[$get[msg]]%5C%22%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22en-US%5C%22%5D%2C%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%5D%2Cnull%2Cnull%2Cnull%2C%5B1%5D%2C1%2Cnull%2Cnull%2C0%2C0%2C0%5D%22%5D]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://gemini.google.com/]
$httpSetContentType[Text]
$try[
$!httpRequest[https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate;POST]
;
$return[null]
$stop
]
$arrayLoad[a;"wrb.fr";$httpResult]
$!arrayShift[a]
$let[cindex;$arrayFindIndex[a;b;$checkCondition[$advancedTextSplit[$env[b];\\[\\];1]==]]]
$let[index;$sub[$if[$get[cindex]==-1;$arrayLength[a];$get[cindex]];1]]
$let[ret;$replace[$replace[$advancedTextSplit[$env[a;$get[index]];null,null;1;null,null;0;\\[\\\\";2;\\[\\],;0;\\\\"\\],;0];\\\\n;
];\\\\;]]
$return[$if[$get[ret]==;null;$get[ret]]]
`
}
