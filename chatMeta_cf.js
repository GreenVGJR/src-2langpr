// Credits:
// https://github.com/Strvm/meta-ai-api

module.exports = {
    name: "chatMeta",
    params: [
    {
        name: "query", // string
        description: "Query",
        required: true
    },
    {
        name: "hardrefresh", // bool
        description: "Hard refresh auth data if something wrong happen",
        type: "Boolean",
        required: false
    },
    {
        name: "userAgent", // string
        description: "Spoof Client",
        required: false
    }],
    code: `
$let[agent;$if[$or[$env[userAgent]==null;$env[userAgent]==];Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36;$env[userAgent]]]
$let[forcerefresh;$if[$or[$env[hardrefresh]==null;$env[hardrefresh]==];false;$toLowercase[$env[hardrefresh]]]]
$if[$get[forcerefresh]==true;$setGlobalVar[authai_meta-yeszqvdv4sjhciobvr5cxq;]]
$jsonLoad[tsr;$getGlobalVar[authai_meta-yeszqvdv4sjhciobvr5cxq;{}]]
$localFunction[fetchmetaweb;
$logger[Info;Fetch Meta.ai Webpage]
$if[$env[tsr;cookies]!=;$let[tempcookies;$env[tsr;cookies]];$logger[Info;Looking Token & Cookies]]
$let[responseHttp;$djsEval[
(async () => {
    try {
        const { request } = require("undici")\\;
        const res = await request("https://www.meta.ai", {
            method: "GET",
            headers: {
                "Accept": "text/html, */*",
                "Accept-Language": "en",
                ...(ctx.hasKeyword("tempcookies") ? { Cookie: ctx.getKeyword("tempcookies") } : {}),
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "User-Agent": ctx.getKeyword("agent")
            }
        })\\;
        
        ctx.setKeyword("cookies", res.headers?.\\['set-cookie'\\]?.split("\\;")?.\\[0\\] || "")\\;
        
        return await res.body.text()\\;
    } catch {}
})()
]]
$onlyIf[$checkContains[$get[responseHttp];KadabraGeoBlockedError]!=true;$logger[Error;Geo-blocked] $let[geoblocked;true]]
$let[lsd;$advancedTextSplit[$get[responseHttp];"LSD";1;";3]]
$if[$advancedTextSplit[$get[responseHttp];"accessToken";1;";1]!=;
$let[access_token;$advancedTextSplit[$get[responseHttp];"accessToken";1;";1]]
$!jsonSet[tsr;access_token;$get[access_token]]
$!jsonSet[tsr;lsd;$get[lsd]]
$!jsonSet[tsr;valid;true]
$setGlobalVar[authai_meta-yeszqvdv4sjhciobvr5cxq;$jsonStringify[tsr]]
;
$logger[Warn;Token not found. Will attempt try in last stage]
]
$let[abra_csrf;$advancedTextSplit[$get[responseHttp];"abra_csrf";1;"value":";1;";0]]
$if[$has[access_token]==false;
$let[cookies;$get[cookies]\\; abra_csrf=$get[abra_csrf]]
;
$let[cookies;$env[tsr;cookies]]
]

$arrayLoad[a;script type="application/json";$get[responseHttp]]
$jsonLoad[c;$advancedTextSplit[$env[a;$arrayFindIndex[a;b;$checkCondition[$advancedTextSplit[$env[b];"consistency";1;"rsrcMap";1]!=]]];data-sjs>;1;</script>;0]]
$jsonLoad[c;$env[c;require;0;3;0;rsrcMap]]
$jsonLoad[test;$jsonEntries[c]]
$arrayMap[test;p;$if[$checkContains[$env[p;1;src];-j/];$return[$env[p]]];test]
$if[$env[tsr;docid;1]==;
$let[m;true]
$let[docid_md;]
$arrayLoad[a;script src=";$get[responseHttp]]
$arrayMap[a;aa;$if[$isValidLink[$advancedTextSplit[$env[aa];";0]];$return[$advancedTextSplit[$env[aa];";0]]];a]
$logger[Info;Looking DocID]
$arrayForEach[a;aa;
$if[$get[m];
$try[
$httpSetContentType[Text]
$httpAddHeader[User-Agent;$get[agent]]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[sec-fetch-site;cross-site]
$!httpRequest[$env[aa];GET]
]
$if[$advancedTextSplit[$httpResult;useKadabraSendMessageMutation;1;exports=;1]!=;
$let[docid_md;$advancedTextSplit[$httpResult;useKadabraSendMessageMutation;1;exports=;1;";1]]
$logger[Info;Prompt | $get[docid_md]]
$let[m;false]
]]]
]
$if[$env[tsr;docid;0]==;
$let[f;true]
$let[docid_ls;]
$logger[Info;Looking second DocID]
$arrayForEach[test;tests;
$if[$get[f];
$try[
$httpSetContentType[Text]
$httpAddHeader[User-Agent;$get[agent]]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[sec-fetch-site;cross-site]
$!httpRequest[$env[tests;1;src];GET]
]
$if[$advancedTextSplit[$httpResult;useKadabraAcceptTOSForTempUserMutation;1;exports=;1]!=;
$let[docid_ls;$advancedTextSplit[$httpResult;useKadabraAcceptTOSForTempUserMutation;1;exports=;1;";1]]
$logger[Info;Token | $get[docid_ls]]
$let[f;false]
]]]
]]

$if[$has[access_token]==false;
$localFunction[meta_ai-rt_test;
$try[
$httpSetBody[av=0&__user=0&__a=1&dpr=1&lsd=$get[lsd]&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useKadabraAcceptTOSForTempUserMutation&server_timestamps=true&doc_id=$get[docid_ls]&variables={"dob":"2000-01-01","__relay_internal__pv__AbraQPDocUploadNuxTriggerNamerelayprovider":"meta_dot_ai_abra_web_doc_upload_nux_tour","__relay_internal__pv__AbraSurfaceNuxIDrelayprovider":"0"}]
$httpSetContentType[Text]
$httpAddHeader[User-Agent;$get[agent]]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Accept;*/*]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[Accept-Language;en]
$httpAddHeader[Cookie;$get[cookies]]
$httpAddHeader[Referer;https://www.meta.ai]
$httpAddHeader[Origin;https://www.meta.ai]
$httpAddHeader[sec-fetch-site;same-origin]
$httpAddHeader[x-asbd-id;359341] $c[Seems static]
$httpAddHeader[x-fb-friendly-name;useKadabraAcceptTOSForTempUserMutation]
$httpAddHeader[x-fb-lsd;$get[lsd]]
$!httpRequest[https://www.meta.ai/api/graphql/;POST;ln]
]
$onlyIf[$env[ln]!=;$callLocalFunction[meta_ai-rt_test]]
$jsonLoad[lnj;$env[ln]]
$onlyIf[$env[lnj;data]!=;$callLocalFunction[meta_ai-rt_test]]
]
$if[$env[tsr;valid]!=true;
$callLocalFunction[fetchmetaweb]
]
$if[$get[geoblocked]==true;
$return[Meta AI isn't available yet in your country]
]
$if[$env[tsr;valid]!=true;
$callLocalFunction[meta_ai-rt_test]
$let[access_token;$env[lnj;data;xab_abra_accept_terms_of_service;new_temp_user_auth;access_token]]
$!jsonSet[tsr;{}]
$!jsonSet[tsr;valid;true]
$!jsonSet[tsr;lsd;$get[lsd]]
$!jsonSet[tsr;cookies;$get[cookies]]
$!jsonSet[tsr;docid;{}]
$!jsonSet[tsr;docid;0;$get[docid_ls]]
$!jsonSet[tsr;docid;1;$get[docid_md]]
$!jsonSet[tsr;access_token;$get[access_token]]
$setGlobalVar[authai_meta-yeszqvdv4sjhciobvr5cxq;$jsonStringify[tsr]]
]]]

$if[$checkContains[$env[tsr;access_token];DOCTYPE html];
$!jsonSet[tsr;valid;false]
$delete[access_token]
$callLocalFunction[fetchmetaweb]
$callLocalFunction[meta_ai-rt_test]
]

$let[retry;0]
$localFunction[fetchmsg;
$if[$get[retry]>=3;$return]
$if[$env[refresh]==true;$letSum[retry;1]]
$let[threadid;$djsEval[const generateOfflineThreadingId = () => (((BigInt(Date.now()) << 22n) | (BigInt('0x' + require('crypto').randomBytes(8).toString('hex')) & ((1n << 22n) - 1n))) & ((1n << 64n) - 1n)).toString()\\; generateOfflineThreadingId()]]
$try[
$jsonLoad[kas;{}]
$!jsonSet[kas;sensitive_string_value;$env[query]]
$httpSetBody[av=0&__user=0&__a=1&dpr=1&lsd=$env[tsr;lsd]&access_token=$env[tsr;access_token]&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useKadabraSendMessageMutation&variables={"message":$jsonStringify[kas],"externalConversationId":"$randomUUID","offlineThreadingId":"$get[threadid]","suggestedPromptIndex":null,"flashVideoRecapInput":{"images":\\[\\]},"flashPreviewInput":null,"promptPrefix":null,"entrypoint":"ABRA__CHAT__TEXT","icebreaker_type":"TEXT","__relay_internal__pv__WebPixelRatiorelayprovider":1}&server_timestamps=true&doc_id=$env[tsr;docid;1]]
$httpAddHeader[Accept-Encoding;]
$httpAddHeader[Content-Type;application/x-www-form-urlencoded]
$httpAddHeader[Cookie;$env[tsr;cookies]]
$httpAddHeader[Origin;https://www.meta.ai]
$httpAddHeader[Referer;https://www.meta.ai]
$httpAddHeader[Sec-Fetch-Dest;empty]
$httpAddHeader[Sec-Fetch-Site;same-site]
$httpAddHeader[User-Agent;$get[agent]]
$httpAddHeader[x-fb-friendly-name;useKadabraSendMessageMutation]
$!httpRequest[https://graph.meta.ai/graphql?locale=user;POST;resmeta]
]
$if[$or[$env[resmeta;data;xfb_silverstone_send_message;bot_response_message]==null;$env[resmeta;data]==];
$callLocalFunction[fetchmetaweb]
$callLocalFunction[fetchmsg;true]
$return
]
;refresh]
$callLocalFunction[fetchmsg;false]
$arrayLoad[a;
;$env[resmeta]]
$jsonLoad[b;$env[a;$sub[$arrayLength[a];1]]]
$return[$default[$default[$env[b;data;node;bot_response_message;snippet];$env[b;data;node;bot_response_message;content;agent_steps;0;composed_text;content;0;text]];null]]
    `
}
