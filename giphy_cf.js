module.exports = [{
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
}]
