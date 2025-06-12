module.exports = {
    name: "getLyricsTrack",
    params: [{
        name: "query", // string
        description: "To get a Lyrics",
        required: true
    },
    {
        name: "userAgent", // string
        description: "Spoof Client",
        required: false
    }],
    code: `
    $let[agent;$if[$env[userAgent]==null;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36;$env[userAgent]]]
    $httpAddHeader[User-Agent;$get[agent]]
    $let[http_1;$httpRequest[https://genius.com/api/search/song?&per_page=1&q=$encodeURI[$env[query]];GET;ges]]
    $if[$env[ges;response;sections;0;hits;0]!=;
    $httpAddHeader[User-Agent;$get[agent]]
    $let[http2_1;$httpRequest[https://genius.com$env[ges;response;sections;0;hits;0;result;api_path]/embed.js;GET;ges2]]
    $let[a2;$advancedTextSplit[$replace[$replace[$replace[$env[ges2];\\\\n;
];\\\\;];<br>;];<p>;1;</p>;0]]
    $if[$advancedTextSplit[$get[a2];<a href=";1]!=;
    $arrayLoad[a2_rest;<a href=";$get[a2]]
    $let[r1;$advancedTextSplit[$get[a2];<a href=";0]]
    $arrayForEach[a2_rest;restore_a2;$let[r1;$get[r1]$advancedTextSplit[$env[restore_a2];https://;1;">;1]]]
    $let[a2;$get[r1]]
    ]
    $let[a2_filtering;$trimLines[$replace[$replace[$replace[$replace[$replace[$replace[$replace[$replace[$get[a2];
;\\\\n];<a>;];</a>;];<i>;];</i>;];<b>;];</b>;];";\\\\"]]]
    $arrayLoad[results;]
    $arrayPushJSON[results;$trimLines[{"status_1":$get[http_1],"status_2":$get[http2_1],"results":{"provider":"genius","query":"$encodeURI[$env[query]]","url":"$env[ges;response;sections;0;hits;0;result;url]","autocomplete":"$env[ges;response;sections;0;hits;0;result;title_with_featured]","lyric":"$get[a2_filtering]"}}]]
    ;
    $httpAddHeader[User-Agent;$get[agent]]
    $httpRequest[https://www.azlyrics.com/geo.js;GET;g1]
    $httpAddHeader[User-Agent;$get[agent]]
    $let[http;$httpRequest[https://search.azlyrics.com/suggest.php?q=$encodeURI[$env[query]]&x=$advancedTextSplit[$env[g1];"value",;1;";1;";0];GET;res]]
    $let[cacsongs;$advancedTextSplit[$env[res];"songs":;1;\\[;1;\\];0]]
    $onlyIf[$get[cacsongs]!=;$return[{}]]
    $jsonLoad[cacheres;$replace[$env[res];\\\\;\\\\\\\\\\\\\\\\\\\\\\\\\\\\]]
    $let[a;$replace[$env[cacheres;songs;0;url];\\\\;]]
    $let[b;$env[cacheres;songs;0;autocomplete]]

    $httpAddHeader[User-Agent;$get[agent]]
    $let[http2;$httpRequest[$get[a];GET;res2]]
    $let[a1;$replace[$advancedTextSplit[$env[res2];class="lyricsh";1;<div>;1;</div>;0;-->;1];<br>;]]
    $let[a1;$trimLines[$replace[$replace[$replace[$replace[$replace[$replace[$replace[$replace[$get[a1];
;\\\\n];<a>;];</a>;];<i>;];</i>;];<b>;];</b>;];";\\\\"]]]
    $arrayLoad[results;]
    $arrayPushJSON[results;$trimLines[{"status_1":$get[http],"status_2":$get[http2],"results":{"provider":"azlyrics","query":"$encodeURI[$env[query]]","url":"$get[a]","autocomplete":"$get[b]","lyric":"$get[a1]"}}]]
    ]
    $return[$env[results;0]]
    `
}
