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
},
{
    name: "onTTS", // bool
    description: "Output the TTS Response (Default: false)",
    required: false
}],
code: `
$let[texts;$encodeURI[$advancedReplace[$env[query];";\\\\\\\\\\\\";
;\\\\\\\\n]]]
$let[mode;$if[$or[$env[mode]==null;$env[mode]==];auto;$env[mode]]]
$let[to_mode;$if[$or[$env[tr_to]==null;$env[tr_to]==];en;$env[tr_to]]]
$let[checkinfo;$checkCondition[$env[info]==true]]
$let[withtts;$if[$and[$env[onTTS]==true;$get[checkinfo]];$env[onTTS];false]]
$jsonLoad[anjson;{}]
$if[$get[withtts];
$let[ttsquery;$if[$sub[$argCount[$cropText[$env[query];0;100;]];1]<1;1;$sliceText[$env[query];0;$sub[$argCount[$cropText[$env[query];0;100;]];1]]]]
$let[tts_texts;$encodeURI[$advancedReplace[$get[ttsquery];";\\\\\\\\\\\\";
;\\\\\\\\n]]]
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;gzip]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B%5C%22$get[tts_texts]%5C%22%2C%5C%22$if[$get[mode]==auto;en;$get[mode]]%5C%22%2Cnull%2C%5C%22undefined%5C%22%2C%5B0%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$!httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST]
]
$let[tkbs64tts;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;\\[\\\\";1;\\\\";0];null]]
]
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;gzip]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22MkEWBc%22%2C%22%5B%5B%5C%22$get[texts]%5C%22%2C%5C%22$get[mode]%5C%22%2C%5C%22$get[to_mode]%5C%22%2C1%2Cnull%2C2%5D%2C%5B%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$let[httpstatus;$httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST;res]]
]
$arrayLoad[ah;null,null,null,null,null,;$env[res]]
$!arrayShift[ah]
$arrayLoad[as;1\\],;$arrayJoin[ah;]]
$arrayMap[as;lk;$return[$advancedTextSplit[$env[lk];\\[\\\\\\";1;\\\\",;0]];ah]
$let[results;$advancedReplace[$arrayJoin[ah; ];\\\\\\\\;\\\\;\\\\";";\\\\n;\\\n]]
$if[$get[withtts];
$let[ttsquery_res;$if[$sub[$argCount[$cropText[$get[results];0;100;]];1]<1;1;$sliceText[$get[results];0;$sub[$argCount[$cropText[$get[results];0;100;]];1]]]]
$let[tts_texts_res;$encodeURI[$advancedReplace[$get[ttsquery_res];";\\\\\\\\\\\\";
;\\\\\\\\n]]]
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept-Encoding;gzip]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Origin;https://translate.google.com]
$httpSetBody[f.req=%5B%5B%5B%22jQ1olc%22%2C%22%5B%5C%22$get[tts_texts_res]%5C%22%2C%5C%22$get[to_mode]%5C%22%2Cnull%2C%5C%22undefined%5C%22%2C%5B0%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D]
$!httpRequest[https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?hl=en-US;POST]
]
$let[tkts64tts;$default[$advancedTextSplit[$httpResult;"wrb.fr";1;\\[\\\\";1;\\\\";0];null]]
]
$!jsonSet[anjson;status;$default[$get[httpstatus];null]]
$!jsonSet[anjson;results;$default[$trim[$get[results]];null]]
$!jsonSet[anjson;detectedLang;$default[$advancedTextSplit[$env[res];"wrb.fr";1;null,null,null,\\[;3;,1,;1;\\\\";1];$default[$advancedTextSplit[$env[res];"wrb.fr";1;null,null,null,\\[;2;,1,;1;\\\\";1];null]]]
$!jsonSet[anjson;translateLang;$default[$advancedTextSplit[$env[res];"wrb.fr";1;null,null,null,\\[;3;,1,;0;\\\\";1];$default[$advancedTextSplit[$env[res];"wrb.fr";1;null,null,null,\\[;2;,1,;0;\\\\";1];null]]]
$!jsonSet[anjson;tts;{}]
$!jsonSet[anjson;tts;status;$get[withtts]]
$!jsonSet[anjson;tts;audio;{}]
$!jsonSet[anjson;tts;audio;from;$default[$get[tkbs64tts];null]]
$!jsonSet[anjson;tts;audio;to;$default[$get[tkts64tts];null]]
$return[$if[$get[checkinfo]==false;$env[anjson;results];$env[anjson]]]
`
}
