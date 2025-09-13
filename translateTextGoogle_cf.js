module.exports = {
name: "translateTextGoogle",
params: [{
    name: "query", // string
    description: "To show a results",
    required: true
},
{
    name: "mode", // string
    description: "Translate mode (Default: auto)",
    required: false
},
{
    name: "tr_to", // string
    description: "Translate to (Default: en)",
    required: false
},
{
    name: "info", // bool
    description: "Show a info in JSON (Default: false)",
    required: false
}],
code: `
$let[texts;$encodeURI[$advancedReplace[$env[query];";\\\\\\\\\\\\";
;\\\\\\\\n]]]
$let[mode;$if[$or[$env[mode]==null;$env[mode]==];auto;$env[mode]]]
$let[to_mode;$if[$or[$env[tr_to]==null;$env[tr_to]==];en;$env[tr_to]]]
$jsonLoad[anjson;{}]
$try[
$httpSetContentType[Text]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22MkEWBc%22%2C%22%5B%5B%5C%22$get[texts]%5C%22%2C%5C%22$get[mode]%5C%22%2C%5C%22$get[to_mode]%5C%22%2C1%2Cnull%2C2%5D%2C%5B%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$let[httpstatus;$httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST]]
]
$arrayLoad[ah;null,null,null,null,null,;$httpResult]
$!arrayShift[ah]
$arrayLoad[as;1\\],;$arrayJoin[ah;]]
$arrayMap[as;lk;$return[$advancedTextSplit[$env[lk];\\[\\\\\\";1;\\\\",;0]];ah]
$let[results;$advancedReplace[$arrayJoin[ah; ];\\\\\\\\;\\\\;\\\\";";\\\\n;\\\n]]
$!jsonSet[anjson;status;$default[$get[httpstatus];null]]
$!jsonSet[anjson;results;$default[$trim[$get[results]];null]]
$!jsonSet[anjson;detectedLang;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;null,null,null,\\[;3;,1,;1;\\\\";1];$default[$advancedTextSplit[$httpResult;"wrb.fr";1;null,null,null,\\[;2;,1,;1;\\\\";1];null]]]
$!jsonSet[anjson;translateLang;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;null,null,null,\\[;3;,1,;0;\\\\";1];$default[$advancedTextSplit[$httpResult;"wrb.fr";1;null,null,null,\\[;2;,1,;0;\\\\";1];null]]]
$if[$or[$env[info]==null;$env[info]==;$env[info]==false];$env[anjson;results];$env[anjson]]
`
}
