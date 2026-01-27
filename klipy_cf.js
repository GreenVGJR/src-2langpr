module.exports = [{
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
