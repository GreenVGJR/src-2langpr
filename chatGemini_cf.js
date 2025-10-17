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
;\\\\\\\\n]]
$let[retry;0]
$localFunction[fetchgemini;
$onlyIf[$get[retry]<3;$let[ret;null]]
$if[$env[refresh]==true;$letSum[retry;1]]
$try[
$httpSetBody[f.req=%5Bnull%2C%22%5B%5B%5C%22$encodeURI[$get[msg]]%5C%22%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22en-US%5C%22%5D%2C%5B%5C%22%5C%22%2C%5C%22%5C%22%2C%5C%22%5C%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5C%22%5C%22%5D%2Cnull%2C%5C%22%5C%22%2Cnull%2C%5B1%5D%2C1%2Cnull%2Cnull%2C1%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B0%5D%5D%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C1%2Cnull%2Cnull%2C%5B4%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B2%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%5D%22%5D]
$httpAddHeader[Accept-Encoding;gzip]
$httpAddHeader[Accept-Language;en-US]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://bard.google.com/]
$httpAddHeader[Referer;https://bard.google.com/]
$httpAddHeader[User-Agent;Mozilla/5.0 (Linux\\; Android 10\\; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6998.135 Mobile Safari/537.36 EdgA/134.0.3124.68]
$httpSetContentType[Text]
$!httpRequest[https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate;POST]
;
$onlyIf[1!=1;$let[ret;null]]
]
$jsonLoad[tns;$advancedTextSplit[$httpResult;}'
;1]]
$arrayForEach[tns;s;
$if[$and[$env[s;0]==wrb.fr;$env[s;2]!=];
$try[$jsonLoad[tr;$env[s;2]]]
$if[$env[tr;23]==true;
$let[ret;$env[tr;4;0;1;0]]
]]]
$if[$get[ret]==;$callLocalFunction[fetchgemini;true]]
;refresh]
$callLocalFunction[fetchgemini;false]
$return[$get[ret]]
`
}
