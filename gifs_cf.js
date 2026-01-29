module.exports = [{
    name: "searchTenor",
    params: [{
        name: "query",
        description: "Search Tenor Media",
        type: "String",
        required: true
    },
    {
        name: "type", // all, gif, sticker, meme | Default: all
        description: "Media Type",
        type: "String",
        required: false
    },
    {
        name: "checkapi", // Default: false
        description: "Use API to fetch",
        type: "Boolean",
        required: false
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[query;$if[$env[type]==gif;?format=gifs;$if[$env[type]==sticker;?format=stickers;$if[$env[type]==meme;?format=memes]]]]
    $let[queryapi;$if[$or[$env[type]==;$env[type]==null;$env[type]==all];&searchfilter=none;$if[$env[type]==sticker;&searchfilter=sticker;$if[$env[type]==meme;&searchfilter=static,-sticker]]]]

    $try[
    $httpSetContentType[Text]
    $httpAddHeader[Accept;*/*]
    $httpAddHeader[Accept-Language;en]
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $if[$env[checkapi]==true;
    $httpAddHeader[Referer;https://tenor.com]
    $httpAddHeader[Origin;https://tenor.com]
    $c[Seems static key so no need to fetch webpage]
    $httpAddHeader[X-Goog-Api-Key;AIzaSyC-P6_qz3FzCoXGLk6tgitZo4jEJ5mLzD8]
    $let[http;$httpRequest[https://tenor.googleapis.com/v2/search?prettyPrint=false&q=$encodeURI[$toLowercase[$env[query]]]&fields=results&limit=50&client_key=tenor_web&locale=en&anon_id=$get[queryapi];GET]]
    $if[$get[http]!=200;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    $return[$jsonStringify[finalres]]
    ]
    $jsonLoad[finsr;$httpResult]
    $!jsonSet[finalres;data;{}]
    $!jsonSet[finalres;data;suggestion;null]
    $!jsonSet[finalres;data;data;$env[finsr;results]]
    ;
    $let[http;$httpRequest[https://tenor.com/search/$toLowercase[$env[query]]-gifs$get[query];GET]]
    $if[$and[$advancedTextSplit[$httpResult;<html>;1;</html>;0]!=;$advancedTextSplit[$httpResult;form id="captcha-form";1]!=];
    $!jsonSet[finalres;error;Blocked recaptcha]
    $return[$jsonStringify[finalres]]
    ]
    $if[$get[http]!=200;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    $return[$jsonStringify[finalres]]
    ]
    $jsonLoad[finsr;$advancedTextSplit[$httpResult;script id="store-cache";1;">;1;</script>;0]]
    $jsonLoad[finlk;$env[finsr;universal;search]]
    $jsonLoad[finlk;$jsonEntries[finlk]]
    $jsonLoad[finls;$env[finsr;searchSuggestions]]
    $jsonLoad[finls;$jsonEntries[finls]]
    $!jsonSet[finalres;data;{}]
    $!jsonSet[finalres;data;suggestion;$env[finls;0;1;results]]
    $!jsonSet[finalres;data;data;$env[finlk;0;1;results]]
    ]]

    $return[$jsonStringify[finalres]]
    `
}, {
    name: "infoTenor",
    params: [{
        name: "url",
        description: "Tenor Media URL",
        type: "String",
        required: true
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[postid;$advancedTextSplit[$advancedTextSplit[$env[url];/;4];-;$charCount[$advancedTextSplit[$env[url];/;4];-]]]
    $let[validlink;$and[$isValidLink[$env[url]];$endsWith[$advancedTextSplit[$env[url];/;2];tenor.com];$isNumber[$get[postid]]]]
    $if[$get[validlink];
    $try[
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $httpSetContentType[Text]
    $let[http;$httpRequest[https://tenor.com/embed/$get[postid];GET]]
    $if[$get[http]==200;
    $jsonLoad[finsr;$advancedTextSplit[$httpResult;script id="gif-json";1;">;1;</script>;0]]
    $!jsonSet[finalres;data;{}]
    $!jsonSet[finalres;data;suggestion;null]
    $!jsonSet[finalres;data;data;$jsonStringify[finsr]]
    ;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    ]]]

    $return[$jsonStringify[finalres]]
    `
},
{
    name: "searchGiphy",
    params: [{
        name: "query",
        description: "Search Giphy Media",
        type: "String",
        required: true
    },
    {
        name: "type", // gif, sticker, clip | Default: gif
        description: "Media Type",
        type: "String",
        required: false
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[query;$if[$env[type]==sticker;-stickers;$if[$env[type]==clip;-clips]]]

    $try[
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $let[http;$httpRequest[https://giphy.com/search/$env[query]$get[query];GET]]
    $if[$get[http]==200;
    $arrayLoad[a;self.__next_f.push(;$httpResult]
    $!arrayShift[a]
    $jsonLoad[b;$advancedTextSplit[$env[a;$arrayFindIndex[a;b;$checkContains[$env[b];application/ld+json]]];)</script>;0]]
    $jsonLoad[c;$advancedTextSplit[$env[b;1];$advancedTextSplit[$env[b;1];:;0]:;1]]
    $!jsonSet[finalres;data;$env[c;1;3;children;1;3;children;1;3;initialGifs]]
    ;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    ]]
    $return[$jsonStringify[finalres]]
    `
}, {
    name: "infoGiphy",
    params: [{
        name: "url",
        description: "Giphy Media URL",
        type: "String",
        required: true
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[validlink;$and[$isValidLink[$env[url]];$endsWith[$advancedTextSplit[$env[url];/;2];giphy.com]]]
    $if[$get[validlink];
    $try[
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $let[http;$httpRequest[$env[url];GET]]
    $if[$get[http]==200;
    $arrayLoad[a;self.__next_f.push(;$httpResult]
    $!arrayShift[a]
    $jsonLoad[b;$advancedTextSplit[$env[a;$arrayFindIndex[a;b;$checkContains[$env[b];application/ld+json]]];)</script>;0]]
    $jsonLoad[c;$advancedTextSplit[$env[b;1];$advancedTextSplit[$env[b;1];:;0]:;1]]
    $!jsonSet[finalres;data;{}]
    $!jsonSet[finalres;data;suggestion;$env[c;1;3;geoTargetedRequest;keywords]]
    $!jsonSet[finalres;data;data;$env[c;1;3;children;1;3;children;3;children;0;3;children;0;3;children;1;3;children;1;3;children;1;3;gif]]
    $!jsonSet[finalres;data;data;user;$env[c;1;3;children;1;3;children;3;children;0;3;children;0;3;children;0;3;children;0;3;user]]
    ;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    ]]]

    $return[$jsonStringify[finalres]]
    `
},
{
    name: "searchKlipy",
    params: [{
        name: "query",
        description: "Search Klipy Media",
        type: "String",
        required: true
    },
    {
        name: "type", // gif, sticker, clip, emoji, ai_gif | Default: gif
        description: "Media Type",
        type: "String",
        required: false
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[query;$if[$env[type]==sticker;stickers;$if[$env[type]==clip;clips;$if[$env[type]==emoji;emojis;$if[$env[type]==ai_gif;ai-gifs;gifs]]]]]

    $try[
    $httpSetContentType[Text]
    $httpAddHeader[Referer;https://klipy.com]
    $httpAddHeader[Origin;https://klipy.com]
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $let[http;$httpRequest[https://api.klipy.com/api/v1/web/$get[query]/search?q=$env[query]&locale=en-US&per_page=50;GET]]
    $if[$get[http]==200;
    $jsonLoad[finsr;$httpResult]
    $!jsonSet[finalres;data;$env[finsr;data;data]]
    ;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    ]]
    $return[$jsonStringify[finalres]]
    `
}, {
    name: "infoKlipy",
    params: [{
        name: "url",
        description: "Klipy Media URL",
        type: "String",
        required: true
    }],
    code: `
    $jsonLoad[finalres;{"error":null,"data":null}]
    $let[validlink;$and[$isValidLink[$env[url]];$endsWith[$advancedTextSplit[$env[url];/;2];klipy.com]]]
    $if[$get[validlink];
    $try[
    $httpAddHeader[User-Agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36]
    $let[http;$httpRequest[https://api.klipy.com/api/v1/web/$advancedTextSplit[$env[url];klipy.com/;1];GET]]
    $if[$get[http]==404;
    $!jsonSet[finalres;error;$get[http] - Not found]
    ;
    $if[$get[http]==200;
    $!jsonSet[finalres;data;$httpResult[data]]
    ;
    $let[http;$httpRequest[$env[url]$if[$endsWith[$env[url];/]==false;/]player;GET]]
    $if[$get[http]==200;
    $arrayLoad[a;self.__next_f.push(;$httpResult]
    $!arrayShift[a]
    $let[lksindex;$arrayFindIndex[a;b;$checkContains[$env[b];\\\\"media\\\\"]]]
    $let[lks;$advancedTextSplit[$env[a;$get[lksindex]];)</script>;0]]
    $jsonLoad[b;$get[lks]]
    $arrayLoad[d;:;$env[b;1]]
    $arraySlice[d;d;$arrayFindIndex[d;e;$checkContains[$env[e];"media"]]]
    $let[finaljson;$arrayJoin[d;:]]
    $if[$isJSON[$get[finaljson]];
    $jsonLoad[c;$get[finaljson]]
    $!jsonSet[finalres;data;$env[c;3;media]]
    ;
    $let[testfinaljson;$advancedTextSplit[$get[finaljson];}\\]};0]}\\]]
    $if[$isJSON[$get[testfinaljson]];
    $jsonLoad[lk;$get[testfinaljson]]
    $!jsonSet[finalres;data;$env[lk;3;media]]
    ;
    $let[lks2;$advancedTextSplit[$env[a;$sum[$get[lksindex];1]];)</script>;0]]
    $jsonLoad[lk;$get[lks2]]
    $jsonLoad[lk;$get[finaljson]$env[lk;1]]
    $!jsonSet[finalres;data;$env[lk;3;media]]
    ]]
    ;
    $!jsonSet[finalres;error;$get[http] - Can't process this]
    ]]]]]

    $return[$jsonStringify[finalres]]
    `
}]
