module.exports = {
name: "chatGemini",
params: [{
name: "prompt",
description: "Prompts to chat",
type: "String",
required: true
},
{
name: "info",
description: "Show a info in JSON (Default: false)",
type: "Boolean",
required: false
},
{
name: "googlecookies",
description: "Input Google Cookies / Object data",
type: "String",
required: false
},
{
name: "conversation",
description: "Object conversation",
type: "String",
required: false
},
{
name: "f_imgreq",
description: "Force Generate Image (Unstable) (Default: false)",
type: "Boolean",
required: false
},
{
name: "models",
description: "Choose Gemini Model (default: 3)",
type: "String",
required: false
},
{
// try use this same as browser header where you get cookies if it fails to generate
name: "htUserAgent",
description: "Spoof User Agent",
type: "String",
required: false
}],
code: `
$let[agent;$if[$or[$env[htUserAgent]==null;$env[htUserAgent]==];Mozilla/5.0 (X11\\; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36;$env[htUserAgent]]]
$let[showcontent;$if[$or[$env[info]==null;$env[info]==];false;$env[info]]]
$let[getconvo;$if[$or[$env[conversation]==null;$env[conversation]==];null;$env[conversation]]]
$let[targetModel;$if[$or[$env[models]==null;$env[models]==];3;$toLowercase[$env[models]]]]
$if[$get[targetModel]==3;
$let[convertModel;fbb127bbb056c959]
]
$if[$get[targetModel]==3-thinking;
$let[convertModel;e051ce1aa80aa576]
]
$if[$get[targetModel]==3-pro;
$let[convertModel;e6fa609c3fa255c0]
]
$let[msg;$env[prompt]]
$jsonLoad[29ca8a2268;{"0":null,"1":null,"2":null,"3":null,"4":null,"5":null}]
$jsonLoad[75bcc39312;{"name":null,"email":null,"userid":null,"avatar":null}]
$jsonLoad[5b306f5d5e;{}]
$!jsonSet[5b306f5d5e;auth;\\[null,null\\]]
$!jsonSet[5b306f5d5e;prompt;$env[prompt]]
$!jsonSet[5b306f5d5e;models;\\[\\]]
$!jsonSet[5b306f5d5e;models;0;$get[targetModel]]
$!jsonSet[5b306f5d5e;models;1;$get[convertModel]]
$!jsonSet[5b306f5d5e;response;{}]
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;other;null]
$!jsonSet[5b306f5d5e;response;telemetry;null]
$if[$or[$env[googlecookies]==null;$env[googlecookies]==]==false;
$if[$typeof[$env[googlecookies]]==object;
$jsonLoad[prts;$env[googlecookies]]
$jsonLoad[prts;$decrypt[$inflate[$env[prts;0];base64];$clientToken]]
$jsonLoad[lrts;$env[prts;1]]
$let[grinitcookies;$env[prts;0]]
$let[tempct-gr-aacid;$env[prts;1]]
$let[tempct-gr-pid;$env[prts;2]]
$let[tempct-gr-init;$env[prts;3]]
$let[tempct-gr-timestamp;$env[prts;4]]
$let[tempct-gr-sid;$env[prts;5]]
$!jsonSet[29ca8a2268;0;$env[prts;0]]
$!jsonSet[29ca8a2268;1;"$env[prts;1]"]
$!jsonSet[29ca8a2268;2;"$env[prts;2]"]
$!jsonSet[29ca8a2268;3;"$env[prts;3]"]
$!jsonSet[29ca8a2268;4;"$env[prts;4]"]
$!jsonSet[29ca8a2268;5;"$env[prts;5]"]
$let[tempct-gr-userid;$env[lrts;userid]]
$let[tempct-gr-name;$env[lrts;name]]
$let[tempct-gr-email;$env[lrts;email]]
$let[tempct-gr-avatar;$env[lrts;avatar]]
$!jsonSet[75bcc39312;userid;$get[tempct-gr-userid]]
$!jsonSet[75bcc39312;name;$get[tempct-gr-name]]
$!jsonSet[75bcc39312;email;$get[tempct-gr-email]]
$!jsonSet[75bcc39312;avatar;$get[tempct-gr-avatar]]
;
$if[$and[$env[googlecookies]!=;$env[googlecookies]!=null];
$let[grinitcookies;$env[googlecookies]]
]]]
$if[$has[grinitcookies];
$localFunction[cookiessid;
$let[tempgrinitcs;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
$arrayLoad[lkcinitcookies_1;\\;;$get[tempgrinitcs]]
$arrayMap[lkcinitcookies_1;b;$if[$charCount[$env[b];=]>=1;$return[$trim[$env[b]]]];lkcinitcookies_1]
$let[tempgt-gr-c-0_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__Secure-1PSIDCC]]]
$let[tempgt-gr-c-1_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__Secure-3PSIDCC]]]
$let[tempgt-gr-c-2_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__SIDCC]]]
$let[tempgt-gr-c-3_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];NID]]]
$let[tempgt-gr-c-4_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__Secure-ENID]]]
$let[tempgt-gr-c-5_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__Secure-1PSIDTS]]]
$let[tempgt-gr-c-6_0;$arrayFindIndex[lkcinitcookies_1;a;$startsWith[$env[a];__Secure-3PSIDTS]]]
$arrayLoad[lkcinitcookies_2;\\;;$env[01061ba374ae0b07064d]]
$arrayMap[lkcinitcookies_2;b;$return[$default[$advancedTextSplit[$env[b];, ;1];$advancedTextSplit[$env[b]; ;0]]];lkcinitcookies_2]
$arrayMap[lkcinitcookies_2;b;$if[$and[$charCount[$env[b]; ]==0;$charCount[$env[b]]!=0];$return[$env[b]]];lkcinitcookies_2]
$let[tempgt-gr-c-0_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];__Secure-1PSIDCC];$advancedTextSplit[$env[a];__Secure-1PSIDCC=;1;\\;;0]!=]]]
$let[tempgt-gr-c-1_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];__Secure-3PSIDCC];$advancedTextSplit[$env[a];__Secure-3PSIDCC=;1;\\;;0]!=]]]
$let[tempgt-gr-c-2_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];SIDCC];$advancedTextSplit[$env[a];SIDCC=;1;\\;;0]!=]]]
$let[tempgt-gr-c-3_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];NID];$advancedTextSplit[$env[a];NID=;1;\\;;0]!=]]]
$let[tempgt-gr-c-4_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];__Secure-ENID];$advancedTextSplit[$env[a];__Secure-ENID=;1;\\;;0]!=]]]
$let[tempgt-gr-c-5_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];__Secure-1PSIDTS];$advancedTextSplit[$env[a];__Secure-1PSIDTS=;1;\\;;0]!=]]]
$let[tempgt-gr-c-6_1;$arrayFindIndex[lkcinitcookies_2;a;$and[$startsWith[$env[a];__Secure-3PSIDTS];$advancedTextSplit[$env[a];__Secure-3PSIDTS=;1;\\;;0]!=]]]
$if[$and[$get[tempgt-gr-c-0_0]!=-1;$get[tempgt-gr-c-0_1]!=-1];
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-0_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-0_1]]]
]
$if[$and[$get[tempgt-gr-c-1_0]!=-1;$get[tempgt-gr-c-1_1]!=-1];
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-1_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-1_1]]]
]
$if[$and[$get[tempgt-gr-c-2_0]!=-1;$get[tempgt-gr-c-2_1]!=-1];
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-2_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-2_1]]]
]
$if[$and[$get[tempgt-gr-c-3_0]!=-1;$get[tempgt-gr-c-3_1]!=-1];
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-3_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-3_1]]]
]
$if[$and[$get[tempgt-gr-c-4_0]!=-1;$get[tempgt-gr-c-4_1]!=-1];
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-4_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-4_1]]]
]
$let[grinitcookies_replacement;$arrayJoin[lkcinitcookies_1;\\; ]]
$if[$env[findtsidexist]==true;
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-5_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-5_1]]]
$!jsonSet[lkcinitcookies_1;$get[tempgt-gr-c-6_0];$env[lkcinitcookies_2;$get[tempgt-gr-c-6_1]]]
$let[grinitcookies_replacement;$arrayJoin[lkcinitcookies_1;\\; ]]
]
$return
;01061ba374ae0b07064d;findtsidexist]
$localFunction[62afa6e8f7;
$arrayLoad[5ce6128f45]
$try[
$httpRemoveHeader[Accept-Encoding]
$httpAddHeader[Accept-Language;en]
$httpAddHeader[Cookie;$get[grinitcookies]]
$httpAddHeader[Sec-Fetch-Dest;document]
$httpAddHeader[Sec-Fetch-Site;none]
$httpAddHeader[User-Agent;$get[agent]]
$httpSetContentType[Text]
$let[httprotatetogr_1;$httpRequest[https://gemini.google.com/app;GET]]
]
$if[$or[$and[$advancedTextSplit[$httpResult;<html>;1;</html>;0]!=;$advancedTextSplit[$httpResult;form id="captcha-form";1]!=];$get[httprotatetogr_1]!=200];$return[$env[5ce6128f45]]]
$let[2d460-resex;$checkContains[$httpGetHeader[Set-Cookie];SIDCC=]]
$let[2d460-snlm0e;$advancedTextSplit[$httpResult;"SNlM0e":";1;";0]]
$let[2d460-sid;$advancedTextSplit[$httpResult;"FdrFJe":";1;";0]]
$let[2d460-aa2yr;$advancedTextSplit[$httpResult;/app?authuser=;1;pid=;1;\\\\;0]]
$let[2d460-userid;$advancedTextSplit[$httpResult;"qDCSke":";1;";0]]
$let[2d460-name;$trim[$advancedTextSplit[$httpResult;aria-label="Google Account:;1;&#10\\;;0]]]
$let[2d460-email;$advancedTextSplit[$httpResult;aria-label="Google Account:;1;&#10\\;;1;(;1;);0]]
$let[2d460-avatar;$advancedTextSplit[$httpResult;aria-label="Google Account:;1;src=";1;";0]]
$if[$get[2d460-avatar]!=;
$let[2d460-avatar;$advancedTextSplit[$get[2d460-avatar];=;0]=s0]
]
$if[$and[$get[2d460-resex];$get[2d460-snlm0e]!=;$get[2d460-aa2yr]!=];
$callLocalFunction[cookiessid;$httpGetHeader[Set-Cookie];false]
$!jsonSet[29ca8a2268;0;$get[grinitcookies_replacement]]
$!jsonSet[29ca8a2268;1;"$get[2d460-snlm0e]"]
$!jsonSet[29ca8a2268;2;"$get[2d460-aa2yr]"]
$!jsonSet[29ca8a2268;5;"$get[2d460-sid]"]
$arrayPush[5ce6128f45;$get[2d460-snlm0e]]
$arrayPush[5ce6128f45;$get[2d460-aa2yr]]
$!jsonSet[75bcc39312;userid;$get[2d460-userid]]
$!jsonSet[75bcc39312;name;$get[2d460-name]]
$!jsonSet[75bcc39312;email;$get[2d460-email]]
$!jsonSet[75bcc39312;avatar;$get[2d460-avatar]]
;
$let[abb24-cs_g;true]
]
$return[$env[5ce6128f45]]
]
$localFunction[4fd59fb44e;
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept;*/*]
$httpRemoveHeader[Accept-Encoding]
$httpAddHeader[Referer;https://gemini.google.com]
$httpAddHeader[Cookie;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
$httpAddHeader[User-Agent;$get[agent]]
$let[httprotatetogr_2;$httpRequest[https://accounts.google.com/RotateCookiesPage?og_pid=$env[lr_pid]&rot=3&origin=https://gemini.google.com&exp_id=0;GET]]
]
$if[$get[httprotatetogr_2]!=200;$return[0]]
$callLocalFunction[cookiessid;$httpGetHeader[Set-Cookie];false]
$let[grinitrotateid+hp_init;$advancedTextSplit[$httpResult;init(';1;';0]]
$let[grinitrotatetd+up_init;$round[$trim[$advancedTextSplit[$httpResult;init(';1;,;1]]]]
$!jsonSet[29ca8a2268;0;$get[grinitcookies_replacement]]
$!jsonSet[29ca8a2268;2;"$get[grinitrotatetd+up_init]"]
$!jsonSet[29ca8a2268;3;"$get[grinitrotateid+hp_init]"]
$return[$get[httprotatetogr_2]]
;lr_pid]
$localFunction[396ce1eb75;
$try[
$httpSetContentType[Text]
$httpAddHeader[Accept;*/*]
$httpRemoveHeader[Accept-Encoding]
$httpAddHeader[Content-Type;application/json]
$httpAddHeader[Origin;https://accounts.google.com]
$httpAddHeader[Referer;https://accounts.google.com/RotateCookiesPage?og_pid=$env[lr_pid]&rot=3&origin=https://gemini.google.com&exp_id=0]
$httpAddHeader[Sec-Fetch-Site;same-origin]
$httpAddHeader[Cookie;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
$httpAddHeader[User-Agent;$get[agent]]
$httpSetBody[\\[$default[$get[tempct-gr-pid];$get[grinitrotatetd+up_init]],"$default[$get[tempct-gr-init];$get[grinitrotateid+hp_init]]"\\]]
$let[httpgrrotate_2;$httpRequest[https://accounts.google.com/RotateCookies;POST;g3_2]]
]
$if[$get[httpgrrotate_2]!=200;$return[0]]
$callLocalFunction[cookiessid;$httpGetHeader[Set-Cookie];$checkContains[$httpGetHeader[Set-Cookie];__Secure-1PSIDTS;__Secure-3PSIDTS]]
$!jsonSet[29ca8a2268;0;$get[grinitcookies_replacement]]
$!jsonSet[29ca8a2268;4;"$sum[$getTimestamp;600000]"]
$return[$get[httpgrrotate_2]]
;lr_pid]
$if[$and[$default[$get[tempct-gr-timestamp];0]<=$getTimestamp;$has[tempct-gr-timestamp]==true];
$if[$callLocalFunction[396ce1eb75;$get[tempct-gr-pid]]==200;;$let[abb24-cs_g;true]]
]
$if[$has[tempct-gr-timestamp]==false;
$jsonLoad[rro_gr;$callLocalFunction[62afa6e8f7]]
$if[$get[abb24-cs_g]!=true;
$wait[1s]
$if[$callLocalFunction[4fd59fb44e;$env[rro_gr;1]]==200;;$let[abb24-cs_g;true]]
$if[$get[abb24-cs_g]!=true;
$wait[1s]
$if[$callLocalFunction[396ce1eb75;$env[rro_gr;1]]==200;;$let[abb24-cs_g;true]]
]]
]
$!jsonSet[5b306f5d5e;auth;0;"$deflate[$encrypt[$env[29ca8a2268];$clientToken];base64]"]
$!jsonSet[5b306f5d5e;auth;1;$env[75bcc39312]]
]
$if[$and[$get[getconvo]!=null;$typeof[$get[getconvo]]==object];
$try[
$jsonLoad[clks;$get[getconvo]]
$let[gr-cov_c;$env[clks;c]]
$let[gr-cov_r;$env[clks;r]]
$let[gr-cov_rc;$env[clks;rc]]
$let[gr-cov_convoid;$env[clks;convoid]]
$let[gr-cov_cookies;$inflate[$env[clks;cookies];base64url]]
]]
$let[retry;0]
$let[conthttperr;]
$localFunction[fetchgemini;
$if[$get[retry]>=3;
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BAD_RESPONSE]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;other;$default[$get[conthttperr];null]]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$let[ret;null]
]
$return
]
$if[$env[refresh]==true;$letSum[retry;1]]
$try[
$arrayLoad[las]
$arrayLoad[lab]
$arrayPush[lab;$get[msg]]
$arrayPushJSON[las;"$jsonStringify[lab]"]
$let[vr;$jsonStringify[las]]
$let[filvr;$cropText[$get[vr];5;-5]]
$jsonLoad[httpheader_i6lQlIBEIVwCVXo0;{
"Accept": "*/*",
"Accept-Language": "en",
"Content-Type": "application/x-www-form-urlencoded\\;charset=utf-8",
"Origin": "https://gemini.google.com",
"Referer": "https://gemini.google.com",
"User-Agent": "$get[agent]",
"Sec-Fetch-Dest": "empty",
"Sec-Fetch-Mode": "cors",
"Sec-Fetch-Site": "same-origin",
"x-goog-ext-525001261-jspb": "[1,null,null,null,\\\\"$if[$env[f_imgreq]==true;56fdd199312815e2;$get[convertModel]]\\\\",null,null,0,[4\\],null,null,$if[$env[f_imgreq]==true;2;1]\\]",
"x-goog-ext-525005358-jspb": "[\\\\"$toUpperCase[$randomUUID]\\\\", 1\\]",
"x-goog-ext-73010989-jspb": "[0\\]",
"x-goog-ext-73010990-jspb": "[0\\]",
"x-same-domain": "1"
}]
$if[$and[$has[grinitcookies];$get[abb24-cs_g]!=true];
$let[httpbody;f.req=%5Bnull%2C%22%5B%5B$get[filvr]%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22en%5C%22%5D%2C%5B%5C%22$get[gr-cov_c]%5C%22%2C%5C%22$get[gr-cov_r]%5C%22%2C%5C%22$get[gr-cov_rc]%5C%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5C%22$get[gr-cov_convoid]%5C%22%5D%2C%5C%220.%5C%22%2C%5C%22%5C%22%2Cnull%2C%5B1%5D%2C1%2Cnull%2Cnull%2C1%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B0%5D%5D%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C1%2Cnull%2Cnull%2C%5B4%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B1%5D%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C$if[$env[f_imgreq]==true;14;null]%2Cnull%2Cnull%2Cnull%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5C%22%5C%22%2Cnull%2C%5B%5D%2Cnull%2Cnull%2Cnull%2Cnull%2C%5Bnull%2Cnull%5D%2Cnull%2C2%5D%22%5D&at=$default[$get[tempct-gr-aacid];$get[2d460-snlm0e]]&]
$!jsonSet[httpheader_i6lQlIBEIVwCVXo0;cookie;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
;
$let[httpbody;f.req=%5Bnull%2C%22%5B%5B$get[filvr]%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22en%5C%22%5D%2C%5B%5C%22$get[gr-cov_c]%5C%22%2C%5C%22$get[gr-cov_r]%5C%22%2C%5C%22$get[gr-cov_rc]%5C%22%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5C%22$get[gr-cov_convoid]%5C%22%5D%2C%5C%22%5C%22%2C%5C%22%5C%22%5D%22%5D&]
$if[$has[gr-cov_cookies];
$!jsonSet[httpheader_i6lQlIBEIVwCVXo0;cookie;NID=$get[gr-cov_cookies]]
]
]
$!djsEval[
const { request, Agent } = require("undici")\\;

request("https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=en$if[$and[$default[$get[tempct-gr-sid];$get[2d460-sid]]!=;$has[grinitcookies]];&f.sid=$default[$get[tempct-gr-sid];$get[2d460-sid]]]&rt=c&_reqid=$randomNumber[1031319;7864320]", {
    dispatcher: new Agent({ 
        connect: { 
            family: 4
        },
        bodyTimeout: 60000,
        headersTimeout: 60000,
        keepAliveTimeout: 30000
    }),
    body: ctx.getKeyword("httpbody"),
    method: "POST",
    headers: ctx.getEnvironmentKey("httpheader_i6lQlIBEIVwCVXo0")
})
.then(f => {
    ctx.setKeyword("httpstatus", f.statusCode)\\;
    ctx.setKeyword("httpcookie", f.headers?.\\["set-cookie"\\] || '')\\;
    return f.body.text()
})
.then(a => ctx.setKeyword("httpresult", a))
]
;$let[conthttperr;$env[httperror]];httperror]
$c[Check if ReCaptcha is appear]
$if[$or[$and[$advancedTextSplit[$get[httpresult];<html>;1;</html>;0]!=;$advancedTextSplit[$get[httpresult];form id="captcha-form";1]!=];$get[httpstatus]==302];
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BLOCKED_RECAPTCHA]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;other;Our systems have detected unusual traffic from your computer network]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$let[ret;null]
]
$return
]
$let[nidcookie;]
$if[$has[grinitcookies];
$if[$or[$get[httpstatus]==200;$checkContains[$get[httpcookie];SIDCC=]]==false;
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BAD_COOKIES]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;other;Session cookies are expired or invalid cookies]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$let[ret;Error: Please sign in again]
]
$return
]
$callLocalFunction[cookiessid;$get[httpcookie];false]
$let[nidcookie;$deflate[$advancedTextSplit[$get[grinitcookies_replacement];NID=;1;\\;;0];base64url]]
$!jsonSet[29ca8a2268;0;$get[grinitcookies_replacement]]
$!jsonSet[5b306f5d5e;auth;0;"$deflate[$encrypt[$env[29ca8a2268];$clientToken];base64]"]
$!jsonSet[5b306f5d5e;auth;1;$env[75bcc39312]]
;
$if[$and[$advancedTextSplit[$get[httpcookie];NID=;0;\\;;0]!=;$has[gr-cov_cookies]==false];
$let[plc-gr-s-blocked;true]
;
$if[$advancedTextSplit[$get[httpcookie];NID=;1;\\;;0]!=;
$let[nidcookie;$deflate[$advancedTextSplit[$get[httpcookie];NID=;1;\\;;0];base64url]]
;
$let[nidcookie;$deflate[$get[gr-cov_cookies];base64url]]
]]]
$arrayLoad[tns;
;$get[httpresult]]
$arrayMap[tns;l;
$if[$typeof[$env[l]]==object;
$try[$jsonLoad[msn;$env[l]]]
$return[$jsonStringify[msn]]
];tns]
$let[convoid;]
$let[found1;false]
$let[found2;false]
$arrayReverse[tns;tns]
$arrayForEach[tns;s;
$if[$and[$env[s;0;0]==wrb.fr;$env[s;0;2]!=;$get[found1]==false];
$try[$jsonLoad[tr;$env[s;0;2]]]
$if[$and[$or[$env[tr;2]==;$env[tr;2]==null]==false;$isJSON[$env[tr;2]]];
$try[$jsonLoad[trlc;$env[tr;2]]]
$jsonLoad[trlc;$jsonEntries[trlc]]
$let[found1;true]
$let[convoid;$env[trlc;0;1]]
;
$if[$env[tr;25]!=null;
$let[found1;true]
$let[convoid;$env[tr;25]]
]]]]
$if[$get[convoid]==;
$delete[convoid]
]
$arrayForEach[tns;s;
$if[$and[$env[s;0;0]==wrb.fr;$env[s;0;2]!=;$get[found2]==false];
$try[$jsonLoad[tr;$env[s;0;2]]]
$if[$env[tr;4;0;8;0]==2;
$let[found2;true]
$if[$and[$env[tr;26;0;0;0;9;0;0;0;3;3]!=;$env[tr;26;0;0;0;9;0;0;0;3;3]!=null];
$let[plc-gr-r_render-wm;$djsEval[require("undici").request("$env[tr;26;0;0;0;9;0;0;0;3;3]").then(lr => fetch(lr.headers?.location,{headers:{"Accept":"*/*","Cookie":ctx.getKeyword("grinitcookies_replacement")}}).then(a => a.url).catch()).catch()]]
]
$if[$and[$env[tr;26;0;0;0;9;0;0;0;6;3]!=;$env[tr;26;0;0;0;9;0;0;0;6;3]!=null];
$let[plc-gr-r_render-nowm;$djsEval[require("undici").request("$env[tr;26;0;0;0;9;0;0;0;6;3]").then(lr => fetch(lr.headers?.location,{headers:{"Accept":"*/*","Cookie":ctx.getKeyword("grinitcookies_replacement")}}).then(a => a.url).catch()).catch()]]
]
$c[Check Multiple Response (Experimental)]
$if[$and[$or[$env[tr;4;0;1;0;0]==;$env[tr;4;0;1;0;0]==null]==false;$isJSON[$env[tr;4;0;1;0;0]]];
$let[rccl;$env[tr;4;0;1;0;0]]
$let[rcce;$env[tr;4;0;1;0;1]]
;
$let[rccl;$env[tr;4;0;1;0]]
]
$!jsonSet[5b306f5d5e;response;telemetry;$default[$env[tr;5];null]]
$!jsonSet[5b306f5d5e;response;text;$default[$get[rccl];null]]
$!jsonSet[5b306f5d5e;response;experimental_text;$default[$get[rcce];null]]
$!jsonSet[5b306f5d5e;response;estimate_tokens;[\\]]
$!jsonSet[5b306f5d5e;response;estimate_tokens;0;"$round[$divide[$charCount[$env[prompt]];4]]"]
$!jsonSet[5b306f5d5e;response;estimate_tokens;1;"$round[$divide[$sum[$charCount[$get[rccl]];$charCount[$get[rcce]]];4]]"]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;$if[$or[$env[tr;4;0;0]!=null;$env[tr;4;0;0]!=];$if[$has[convoid];$if[$and[$env[tr;1;0]==$default[$get[gr-cov_c];$env[tr;1;0]]];$if[$get[plc-gr-s-blocked]==true;SIGN_IN_REQUIRED;OK];BAD_COOKIES_OR_EXPIRED];$if[$has[grinitcookies];OK;SIGN_IN_REQUIRED]];BAD_RESPONSE]]
$!jsonSet[5b306f5d5e;response;chat;c;$env[tr;1;0]]
$!jsonSet[5b306f5d5e;response;chat;r;$env[tr;1;1]]
$!jsonSet[5b306f5d5e;response;chat;rc;$env[tr;4;0;0]]
$!jsonSet[5b306f5d5e;response;chat;convoid;$get[convoid]]
$!jsonSet[5b306f5d5e;response;chat;cookies;$get[nidcookie]]
$if[$and[$and[$env[tr;26;0;0;0;9;0;0;0;3;3]!=;$env[tr;26;0;0;0;9;0;0;0;3;3]!=null];$and[$env[tr;26;0;0;0;9;0;0;0;6;3]!=;$env[tr;26;0;0;0;9;0;0;0;6;3]!=null]];
$!jsonSet[5b306f5d5e;response;image;{}]
$!jsonSet[5b306f5d5e;response;image;no_auth;{}]
$!jsonSet[5b306f5d5e;response;image;no_auth;watermark|preview;$get[plc-gr-r_render-wm]]
$!jsonSet[5b306f5d5e;response;image;no_auth;watermark|original;$replace[$get[plc-gr-r_render-wm];=s512;=s0;1]]
$!jsonSet[5b306f5d5e;response;image;no_auth;no_watermark|preview;$get[plc-gr-r_render-nowm]]
$!jsonSet[5b306f5d5e;response;image;no_auth;no_watermark|original;$replace[$get[plc-gr-r_render-nowm];=s512;=s0;1]]
$!jsonSet[5b306f5d5e;response;image;no_auth;expire;"15000"]
$!jsonSet[5b306f5d5e;response;image;auth;{}]
$!jsonSet[5b306f5d5e;response;image;auth;watermark|preview;$env[tr;26;0;0;0;9;0;0;0;3;3]]
$!jsonSet[5b306f5d5e;response;image;auth;watermark|original;$env[tr;26;0;0;0;9;0;0;0;3;3]=s0]
$!jsonSet[5b306f5d5e;response;image;auth;no_watermark|preview;$env[tr;26;0;0;0;9;0;0;0;6;3]]
$!jsonSet[5b306f5d5e;response;image;auth;no_watermark|original;$env[tr;26;0;0;0;9;0;0;0;6;3]=s0]
$!jsonSet[5b306f5d5e;response;image;auth;expire;"86400000"]
]
$!jsonSet[5b306f5d5e;response;other;$default[$env[tr;26;0;0;0;9;0;0;3;1];null]]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$if[$default[$get[plc-gr-r_render-nowm];null]==null;
$let[ret;$default[$get[rccl];null]]
;
$let[ret;$get[plc-gr-r_render-nowm]]
]]
]]]
$if[$get[ret]==;$callLocalFunction[fetchgemini;true]]
;refresh]
$callLocalFunction[fetchgemini;false]
$return[$get[ret]]
`
}
