module.exports = {
name: "translateTextGoogle",
params: [{
    name: "query", // string
    description: "To show a results",
    type: "String",
    required: true
},
{
    name: "mode", // string
    description: "Translate mode (Default: auto)",
    type: "String",
    required: false
},
{
    name: "tr_to", // string
    description: "Translate to (Default: en)",
    type: "String",
    required: false
},
{
    name: "info", // bool
    description: "Show a info in JSON (Default: false)",
    type: "Boolean",
    required: false
},
{
    name: "onTTS", // bool
    description: "Output the TTS Response (Default: false)",
    type: "Boolean",
    required: false
}],
code: `
$let[texts;$env[query]]
$let[mode;$if[$or[$env[mode]==null;$env[mode]==];auto;$env[mode]]]
$let[to_mode;$if[$or[$env[tr_to]==null;$env[tr_to]==];en;$env[tr_to]]]
$let[checkinfo;$checkCondition[$env[info]==true]]
$let[withtts;$if[$and[$env[onTTS]==true;$get[checkinfo]];$env[onTTS];false]]
$jsonLoad[anjson;{}]
$if[$get[withtts];
$let[ttsquery;$sliceText[$env[query];0;$sub[$argCount[$cropText[$env[query];0;100;]];$if[$checkCondition[$charCount[$env[query]]>100];1;0]]]]
$try[
$arrayLoad[las]
$arrayLoad[lab]
$arrayPush[lab;$get[ttsquery]]
$arrayPushJSON[las;"$jsonStringify[lab]"]
$let[vr;$jsonStringify[las]]
$let[filts;$cropText[$get[vr];5;$sub[$charCount[$get[vr]];5]]]
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B$encodeURI[$get[filts]]%2C%5C%22$if[$get[mode]==auto;en;$get[mode]]%5C%22%2Cnull%2C%5C%22undefined%5C%22%2C%5B0%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$!httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST]
]
$let[tkbs64tts;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;\\[\\\\";1;\\\\";0];null]]
]
$try[
$arrayLoad[las]
$arrayLoad[lab]
$arrayPush[lab;$get[texts]]
$arrayPushJSON[las;"$jsonStringify[lab]"]
$let[vr;$jsonStringify[las]]
$let[filts;$cropText[$get[vr];5;$sub[$charCount[$get[vr]];5]]]
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22MkEWBc%22%2C%22%5B%5B$encodeURI[$get[filts]]%2C%5C%22$get[mode]%5C%22%2C%5C%22$get[to_mode]%5C%22%2C1%2Cnull%2C2%5D%2C%5B%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$let[httpstatus;$httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST;res]]
]
$jsonLoad[res;$advancedTextSplit[$env[res];}'

;1]]
$jsonLoad[res;$env[res;0;2]]
$jsonLoad[rest;$env[res;1;0;0;5]]
$arrayMap[rest;lk;$return[$env[lk;0]];rest]
$let[results;$arrayJoin[rest; ]]
$if[$get[withtts];
$let[ttsquery_res;$sliceText[$get[results];0;$sub[$argCount[$cropText[$get[results];0;100;]];$if[$checkCondition[$charCount[$get[results]]>100];1;0]]]]
$arrayLoad[las]
$arrayLoad[lab]
$arrayPush[lab;$get[ttsquery_res]]
$arrayPushJSON[las;"$jsonStringify[lab]"]
$let[vr;$jsonStringify[las]]
$let[filts;$cropText[$get[vr];5;$sub[$charCount[$get[vr]];5]]]
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B$encodeURI[$get[filts]]%2C%5C%22$get[to_mode]%5C%22%2Cnull%2C%5C%22undefined%5C%22%2C%5B0%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$!httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST]
]
$let[tkts64tts;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;\\[\\\\";1;\\\\";0];null]]
]
$!jsonSet[anjson;status;$default[$get[httpstatus];null]]
$!jsonSet[anjson;results;$default[$trim[$get[results]];null]]
$!jsonSet[anjson;detectedLang;$env[res;1;3]]
$!jsonSet[anjson;translateLang;$env[res;1;1]]
$!jsonSet[anjson;tts;{}]
$!jsonSet[anjson;tts;status;$get[withtts]]
$!jsonSet[anjson;tts;audio;{}]
$!jsonSet[anjson;tts;audio;from;$default[$get[tkbs64tts];null]]
$!jsonSet[anjson;tts;audio;to;$default[$get[tkts64tts];null]]
$!jsonSet[anjson;tts;audio;format;$if[$or[$get[tkbs64tts]!=;$get[tkts64tts]!=];mp3;null]]
$return[$if[$get[checkinfo]==false;$env[anjson;results];$env[anjson]]]
`
}
