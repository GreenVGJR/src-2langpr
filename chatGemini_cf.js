module.exports = [{
    name: "chatGemini",
    params: [{
        name: "prompt", description: "Prompts to chat", type: "String", required: true
    }, {
        name: "info", description: "Show a info in JSON (Default: false)", type: "Boolean", required: false
    }, {
        name: "googlecookies", description: "Input Google Cookies / Object data", type: "String", required: false
    }, {
        name: "conversation", description: "Object conversation: $env[...;response;chat]", type: "String", required: false
    }, {
        name: "f_imgreq", description: "Force Generate Image (Default: false)", type: "Boolean", required: false
    }, {
        name: "models", description: "Choose Gemini Model (Default: 3)", type: "String", required: false
    }, {
        name: "htUserAgent", description: "Spoof User Agent", type: "String", required: false
        // try use this same as browser header where you get cookies if it fails to generate
    }],
    code: `
$let[defaultUserAgent;Mozilla/5.0 (X11\\; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36]
$let[agent;$if[$or[$env[htUserAgent]==null;$env[htUserAgent]==];$get[defaultUserAgent];$env[htUserAgent]]]
$let[showcontent;$if[$or[$env[info]==null;$env[info]==];false;$env[info]]]
$let[getconvo;$if[$or[$env[conversation]==null;$env[conversation]==];null;$env[conversation]]]
$let[targetModel;$if[$env[f_imgreq]==true;nano;$if[$or[$env[models]==null;$env[models]==];3.5;$toLowercase[$env[models]]]]]
$c[List Models]
$if[$or[$env[googlecookies]==null;$env[googlecookies]==];
$let[defaultModel;fbb127bbb056c959]
$let[customYYGeminiLogin;0]
;
$let[defaultModel;56fdd199312815e2]
$let[customYYGeminiLogin;1]
]
$ifx[
    $if[$get[targetModel]==3-lite;
    $let[convertModel;8c46e95b1a07cecc]
    ]
    $elseIf[$get[targetModel]==3-pro;
    $let[convertModel;e6fa609c3fa255c0]
    ]
    $else[
    $let[convertModel;$get[defaultModel]]
    ]
]
$let[msg;$env[prompt]]
$let[isAskingConsent;false]
$let[isAskingCaptcha;false]
$jsonLoad[29ca8a2268;{"0":null,"1":null,"2":null,"3":null,"4":null,"5":null}]
$jsonLoad[75bcc39312;{"name":null,"email":null,"userid":null,"avatar":null}]
$jsonLoad[5b306f5d5e;{}]
$!jsonSet[5b306f5d5e;auth;\\[null,null\\]]
$!jsonSet[5b306f5d5e;prompt;$env[prompt]]
$!jsonSet[5b306f5d5e;models;\\[\\]]
$!jsonSet[5b306f5d5e;models;0;$get[targetModel]]
$!jsonSet[5b306f5d5e;models;1;$get[convertModel]]
$!jsonSet[5b306f5d5e;models;2;{}]]
$!jsonSet[5b306f5d5e;models;2;isUsingModel;$if[$get[targetModel]==3.5;true;$checkCondition[$or[$env[googlecookies]==null;$env[googlecookies]==]==false]]]
$!jsonSet[5b306f5d5e;response;{}]
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;gallery;null]
$!jsonSet[5b306f5d5e;response;other;null]
$!jsonSet[5b306f5d5e;response;telemetry;null]
$if[$or[$env[googlecookies]==null;$env[googlecookies]==]==false;
$if[$typeof[$env[googlecookies]]==object;
$jsonLoad[prts;$env[googlecookies]]
$jsonLoad[prts;$env[prts;0]]
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
$localFunction[cookiessid;
$let[tempgrinitcs;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
$let[tempfrreslm1;$callFunction[filterHttpCookies;0;$get[tempgrinitcs]]]
$let[tempfrreslm2;$callFunction[filterHttpCookies;1;$env[01061ba374ae0b07064d]]]
$let[grinitcookies_replacement;$callFunction[filterHttpCookies;2;$get[tempfrreslm1];$get[tempfrreslm2]]]
$return
;01061ba374ae0b07064d;findtsidexist]
$if[$has[grinitcookies];
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
$!jsonSet[5b306f5d5e;auth;0;$env[29ca8a2268]]
$!jsonSet[5b306f5d5e;auth;1;$env[75bcc39312]]
;
$if[$and[$get[getconvo]!=null;$typeof[$get[getconvo]]==object]==false;
$jsonLoad[httpheader_XQdBDcoTqYeNxbNn;{
"Accept": "*/*",
"Accept-Encoding": "identity",
"Accept-Language": "en",
"User-Agent": "$get[agent]",
"Sec-Fetch-Dest": "document",
"Sec-Fetch-Mode": "navigate",
"Sec-Fetch-Site": "none"
}]
$localFunction[fetchwebgeminiforcookie;
$if[$or[$env[inputwebcookies]==;$env[inputwebcookies]==null]==false;
$!jsonSet[httpheader_XQdBDcoTqYeNxbNn;cookie;$env[inputwebcookies]]
]
$let[temppullbodyhttp;$djsEval[
const { Agent, request, createRedirectInterceptor } = require("undici")\\;

request("https://gemini.google.com/app", { dispatcher: new Agent({ connect: { family: 4 }, interceptors: { Agent: [createRedirectInterceptor({ maxRedirections: 15 })\\] } }), headers: ctx.getEnvironmentKey("httpheader_XQdBDcoTqYeNxbNn") })
.then(a => {
    const history = a.context?.history || [\\]\\;
    const finalUrl = (history.length > 0 ? history[history.length - 1\\].href : "https://gemini.google.com/app")\\;
    const isConsentRequire = finalUrl.includes('consent.google.com')\\;
    ctx.setKeyword("isAskingConsent", isConsentRequire)\\;
    ctx.setKeyword("isAskingCaptcha", finalUrl.includes('google.com/sorry'))\\;
    ctx.setKeyword("temppullcookie", a.headers?.["set-cookie"\\]?.join('\\; '))\\;
    return isConsentRequire ? a.body.text() : null\\;
})
.catch()
]]
;inputwebcookies]
$callLocalFunction[fetchwebgeminiforcookie;]

$c[Check if ReCaptcha is appear]
$if[$get[isAskingCaptcha];
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BLOCKED_RECAPTCHA]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;gallery;null]
$!jsonSet[5b306f5d5e;response;other;Our systems have detected unusual traffic from your computer network]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$let[ret;null]
]
$return[$get[ret]]
]

$c[Check if asking consent, then auto accept if any]
$if[$get[isAskingConsent];
$let[temppullcookiesec;$callFunction[filterHttpCookies;1;$get[temppullcookie]]]
$!jsonSet[httpheader_XQdBDcoTqYeNxbNn;cookie;$get[temppullcookiesec]]
$callLocalFunction[fetchwebgeminiforcookie;$callFunction[filterHttpCookies;2;$callFunction[filterHttpCookies;1;$callFunction[solveConsentGemini;$get[temppullbodyhttp];$env[httpheader_XQdBDcoTqYeNxbNn]]];$get[temppullcookiesec]]]
]
$let[grinitcookiesfirst;$callFunction[filterHttpCookies;1;$get[temppullcookie]]]
]]
$if[$and[$get[getconvo]!=null;$typeof[$get[getconvo]]==object];
$try[
$jsonLoad[clks;$get[getconvo]]
$let[gr-cov_c;$env[clks;c]]
$let[gr-cov_r;$env[clks;r]]
$let[gr-cov_rc;$env[clks;rc]]
$let[gr-cov_convoid;$env[clks;convoid]]
$let[gr-cov_cookies;$if[$env[clks;cookies]!=;$inflate[$env[clks;cookies];base64url]]]
]]
$let[retry;0]
$let[conthttperr;]
$localFunction[fetchgemini;
$if[$get[retry]>=3;
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BAD_RESPONSE]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;gallery;null]
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
$jsonLoad[httpheader_i6lQlIBEIVwCVXo0;{
"Accept": "*/*",
"Accept-Encoding": "identity",
"Accept-Language": "en",
"Content-Type": "application/x-www-form-urlencoded\\;charset=utf-8",
"Origin": "https://gemini.google.com",
"Referer": "https://gemini.google.com",
"User-Agent": "$get[agent]",
"Sec-Fetch-Dest": "empty",
"Sec-Fetch-Mode": "cors",
"Sec-Fetch-Site": "same-origin",
"x-goog-ext-525001261-jspb": "[1,null,null,null,\\\\"$get[convertModel]\\\\",null,null,$get[customYYGeminiLogin],[\\],null,null,4,null,null,1,null,\\\\"$toUpperCase[$randomUUID]\\\\"\\]",
"x-goog-ext-525005358-jspb": "[\\\\"$toUpperCase[$randomUUID]\\\\", 1\\]",
"x-goog-ext-73010989-jspb": "[0\\]",
"x-goog-ext-73010990-jspb": "[0,0,0\\]",
"x-same-domain": "1"
}]
$if[$and[$has[grinitcookies];$get[abb24-cs_g]!=true];
$jsonLoad[buildgquery;[null\\]]
$jsonLoad[buildgquerysec;[["",0,null,null,null,null,0\\],["en"\\],["","","",null,null,null,null,null,null,""\\],"1.","",null,[1\\],1,null,null,1,0,null,null,null,null,null,[[1\\]\\],0,null,null,null,null,null,null,null,null,1,null,null,[4\\],null,null,null,null,null,null,null,null,null,null,[2\\],null,null,null,1,null,null,null,null,null,null,null,0,null,null,null,null,null,"",null,[\\],null,null,null,null,null,0,2,null,null,null,null,null,null,null,null,null,null,1\\]]
$!jsonSet[buildgquerysec;0;0;"$get[msg]"]
$!jsonSet[buildgquerysec;2;0;"$get[gr-cov_c]"]
$!jsonSet[buildgquerysec;2;1;"$get[gr-cov_r]"]
$!jsonSet[buildgquerysec;2;2;"$get[gr-cov_rc]"]
$!jsonSet[buildgquerysec;2;9;"$get[gr-cov_convoid]"]
$!jsonSet[buildgquerysec;49;$if[$env[f_imgreq]==true;14;null]]
$arrayPush[buildgquery;$jsonStringify[buildgquerysec]]
$let[httpbody;f.req=$encodeURIComponent[$jsonStringify[buildgquery]]&at=$default[$get[tempct-gr-aacid];$get[2d460-snlm0e]]&]
$!jsonSet[httpheader_i6lQlIBEIVwCVXo0;cookie;$default[$get[grinitcookies_replacement];$get[grinitcookies]]]
;
$jsonLoad[buildgquery;[null\\]]
$jsonLoad[buildgquerysec;[["",0,null,null,null,null,0\\],["en"\\],["","","",null,null,null,null,null,null,""\\],"1.","",null,[1\\],1,null,null,1,0,null,null,null,null,null,[[1\\]\\],0,null,null,null,null,null,null,null,null,1,null,null,[4\\],null,null,null,null,null,null,null,null,null,null,[2\\],null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,"",null,[\\],null,null,null,null,null,null,2,null,null,null,null,null,null,null,null,null,null,1\\]]
$!jsonSet[buildgquerysec;0;0;"$get[msg]"]
$!jsonSet[buildgquerysec;2;0;"$get[gr-cov_c]"]
$!jsonSet[buildgquerysec;2;1;"$get[gr-cov_r]"]
$!jsonSet[buildgquerysec;2;2;"$get[gr-cov_rc]"]
$!jsonSet[buildgquerysec;2;9;"$get[gr-cov_convoid]"]
$arrayPush[buildgquery;$jsonStringify[buildgquerysec]]
$let[httpbody;f.req=$encodeURIComponent[$jsonStringify[buildgquery]]&]
$!jsonSet[httpheader_i6lQlIBEIVwCVXo0;cookie;$default[$get[grinitcookiesfirst];$get[gr-cov_cookies]]]
]
$!djsEval[
const { Agent, request, createRedirectInterceptor } = require("undici")\\;

const streamUrl = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?hl=en$if[$and[$default[$get[tempct-gr-sid];$get[2d460-sid]]!=;$has[grinitcookies]];&f.sid=$default[$get[tempct-gr-sid];$get[2d460-sid]]]&rt=c&_reqid=$randomNumber[1031319;7864320]"\\;

request(streamUrl, {
    dispatcher: new Agent({
        connect: {
            family: 4
        },
        bodyTimeout: 60000,
        headersTimeout: 60000,
        keepAliveTimeout: 30000,
        interceptors: { Agent: [createRedirectInterceptor({ maxRedirections: 15 })\\] }
    }),
    body: ctx.getKeyword("httpbody"),
    method: "POST",
    headers: ctx.getEnvironmentKey("httpheader_i6lQlIBEIVwCVXo0")
})
.then(a => {
    const history = a.context?.history || [\\]\\;
    const finalUrl = (history.length > 0 ? history[history.length - 1\\].href : streamUrl)\\;
    const setCookie = a.headers?.["set-cookie"\\]\\;
    ctx.setKeyword("httpstatus", a.statusCode)\\;
    ctx.setKeyword("httpcookie", Array.isArray(setCookie) ? setCookie.join('\\; ') : (setCookie || ""))\\;
    ctx.setKeyword("isAskingCaptcha", finalUrl.includes('google.com/sorry'))\\;
    return a.body.text()\\;
})
.then(a => ctx.setKeyword("httpresult", a))
.catch()
]
;$let[conthttperr;$env[httperror]];httperror]

$c[Check if ReCaptcha is appear]
$if[$get[isAskingCaptcha];
$!jsonSet[5b306f5d5e;response;text;null]
$!jsonSet[5b306f5d5e;response;chat;{}]
$!jsonSet[5b306f5d5e;response;chat;status;BLOCKED_RECAPTCHA]
$!jsonSet[5b306f5d5e;response;image;null]
$!jsonSet[5b306f5d5e;response;gallery;null]
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
$!jsonSet[5b306f5d5e;response;gallery;null]
$!jsonSet[5b306f5d5e;response;other;Session cookies are expired or invalid cookies]
$if[$env[info]==true;
$let[ret;$env[5b306f5d5e]]
;
$let[ret;Error: Please sign in again]
]
$return
]
$callLocalFunction[cookiessid;$get[httpcookie];false]
$let[nidcookie;$deflate[$get[grinitcookies_replacement];base64url]]
$!jsonSet[29ca8a2268;0;$get[grinitcookies_replacement]]
$!jsonSet[5b306f5d5e;auth;0;$env[29ca8a2268]]
$!jsonSet[5b306f5d5e;auth;1;$env[75bcc39312]]
;
$if[$and[$advancedTextSplit[$get[httpcookie];NID=;0;\\;;0]!=;$has[gr-cov_cookies]==false];
$let[plc-gr-s-blocked;true]
;
$if[$advancedTextSplit[$get[httpcookie];NID=;1;\\;;0]!=;
$let[nidcookie;$deflate[$callFunction[filterHttpCookies;1;$get[httpcookie]];base64url]]
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
$c[Check Gallery Response (Experimental)]
$jsonLoad[preGalleryGemini;{}]
$if[$or[$env[tr;4;0;12;1]==;$env[tr;4;0;12;1]==null]==false;
$jsonLoad[preGalleryGemini;$env[tr;4;0;12;1]]
$arrayMap[preGalleryGemini;ygosb;
$arrayLoad[yynos]
$arrayPush[yynos;$env[ygosb;0;0;0]]
$arrayPush[yynos;$env[ygosb;12;0;0]]
$return[$env[yynos]]
;preGalleryGemini]
$!jsonSet[5b306f5d5e;response;gallery;$env[preGalleryGemini]]
]
$!jsonSet[5b306f5d5e;response;consentAsking;$get[isAskingConsent]]
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
$!jsonSet[5b306f5d5e;response;chat;cookies;$if[$and[$env[googlecookies]!=;$env[googlecookies]!=null];;$get[nidcookie]]]
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
$if[$and[$startsWith[$get[rccl];http://googleusercontent.com];$env[preGalleryGemini;0;0]!=];
$let[ret;$env[preGalleryGemini;0;0]]
;
$let[ret;$default[$get[rccl];null]]
]
;
$let[ret;$replace[$get[plc-gr-r_render-nowm];=s512;=s0;1]]
]]
]]]
$if[$get[ret]==;$callLocalFunction[fetchgemini;true]]
;refresh]
$callLocalFunction[fetchgemini;false]
$return[$get[ret]]
`
},
{
    name: "filterHttpCookies",
    params: [{
        name: "mode", required: true
    }, {
        name: "po", required: true
    }, {
        name: "po2", required: false
    }, {
        // 0 = string | 1 = array
        name: "formatCookiesOutput", required: false
    }],
    code: `
    $if[$env[mode]==0;
    $arrayLoad[kilcookies; ;$env[po]]
    $arrayMap[kilcookies;b;$return[$advancedTextSplit[$trim[$env[b]];\\;;0]];kilcookies]
    $arrayMap[kilcookies;b;$if[$charCount[$env[b];=]>=1;$return[$trim[$env[b]]]];kilcookies]]
    ]
    $if[$env[mode]==1;
    $arrayLoad[kilcookies; ;$env[po]]
    $arrayMap[kilcookies;b;$return[$advancedTextSplit[$trim[$env[b]];\\;;0]];kilcookies]
    $arrayMap[kilcookies;b;$return[$default[$advancedTextSplit[$env[b];, ;1];$advancedTextSplit[$env[b]; ;0]]];kilcookies]
    $arrayMap[kilcookies;b;$if[$and[$charCount[$env[b]; ]==0;$charCount[$env[b]]!=0];$return[$env[b]]];kilcookies]
    $arrayMap[kilcookies;b;
        $let[checkValidCookies;$or[$startsWith[$toLowerCase[$env[b]];domain];$startsWith[$toLowerCase[$env[b]];path];$startsWith[$toLowerCase[$env[b]];expires];$startsWith[$toLowerCase[$env[b]];max-age];$startsWith[$toLowerCase[$env[b]];secure];$startsWith[$toLowerCase[$env[b]];httponly];$startsWith[$toLowerCase[$env[b]];samesite];$startsWith[$toLowerCase[$env[b]];priority];$startsWith[$toLowerCase[$env[b]];partitioned]]]
        $if[$and[$get[checkValidCookies]==false;$charCount[$env[b];=]>=1];$return[$trim[$env[b]]]]
    ;kilcookies]]
    ]
    $if[$env[mode]==2;
    $arrayLoad[kilcookies; ;$env[po]]
    $arrayMap[kilcookies;b;$return[$advancedTextSplit[$trim[$env[b]];\\;;0]];kilcookies]
    $arrayLoad[kilcookies2; ;$env[po2]]
    $arrayMap[kilcookies2;b;$return[$advancedTextSplit[$trim[$env[b]];\\;;0]];kilcookies2]
    $arrayForEach[kilcookies2;llc;
        $let[tempcckvrlv;$advancedTextSplit[$trim[$env[llc]];=;0]]
        $let[tempcckvrll;$advancedTextSplit[$trim[$env[llc]];=;1;\\;;0]]
        $let[tempcckvrlo;$replace[$env[llc];$get[tempcckvrlv]=;]]
        $let[templkcvr;$arrayFindIndex[kilcookies;testlookcook;$startsWith[$env[testlookcook];$get[tempcckvrlv]]]]
        $if[$get[templkcvr]!=-1;
        $if[$get[tempcckvrll]==;$!jsonDelete[kilcookies;$get[templkcvr]];$!jsonSet[kilcookies;$get[templkcvr];$env[llc]]]
        ;
        $if[$and[$env[llc]!=null;$env[llc]!=];$arrayPush[kilcookies;$env[llc]]]
        ]
    ]]
    $if[$env[formatCookiesOutput]==1;
    $return[$jsonStringify[kilcookies]]
    ;
    $return[$trim[$arrayJoin[kilcookies;\\; ]]]
    ]
    `
},
{
    name: "solveConsentGemini",
    params: [{
        name: "blobbodyhttp", required: true
    }, {
        name: "blobheaderhttp", required: true
    }],
    code: `
    $c[Accept all = Allowing continue conversation]
    $jsonLoad[htky;$env[blobheaderhttp]]
    $!jsonSet[htky;origin;https://consent.google.com]
    $!jsonSet[htky;referer;https://consent.google.com]
    $!jsonSet[htky;content-type;application/x-www-form-urlencoded]
    $!jsonSet[htky;same-site;same-origin]
    $arrayLoad[snhk;><input;$advancedTextSplit[$env[blobbodyhttp];Accept all</span>;1]]
    $!arrayShift[snhk]
    $arrayMap[snhk;f0j1;
        $arrayLoad[f0v9; ;$env[f0j1]]
        $return[$advancedTextSplit[$env[f0v9;$arrayFindIndex[f0v9;f0p9;$startsWith[$env[f0p9];name="]]];name=";1;";0]=$advancedTextSplit[$env[f0v9;$arrayFindIndex[f0v9;f0p9;$startsWith[$env[f0p9];value="]]];value=";1;";0]]
    ;snhk]
    $return[$try[$djsEval[
    const { Agent, request } = require("undici")\\;

    request("https://consent.google.com/save", { method: "POST", body: ctx.getEnvironmentKey("snhk").join("&"), dispatcher: new Agent({ connect: { family: 4 } }), headers: ctx.getEnvironmentKey("htky") })
    .then(a => a.headers?.["set-cookie"\\]?.join('\\; ') || null)
    .catch(() => null)
    ];null]]
    `
}]
