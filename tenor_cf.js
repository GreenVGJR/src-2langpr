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
}]
