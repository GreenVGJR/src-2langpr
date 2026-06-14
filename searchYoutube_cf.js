module.exports = [{
    name: "ytVideo",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    },{
        name: "limit", // number
        description: "Limit results",
        required: false
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $let[limitres;$if[$isNumber[$env[limit]]==false;20;$env[limit]]]
    $let[trackresult;0]
    $let[rrmnsnfc;$randomString[16]]
    $arrayLoad[results]
    $localFunction[$get[rrmnsnfc];
    $try[
    $jsonLoad[inputhttpquery;{"context":{"client":{"clientName":1,"clientVersion":"1.20261231","hl":"en","gl":"US"}}}]
    $if[$env[contentId]!=;
    $!jsonSet[inputhttpquery;continuation;$env[contentId]]
    ;
    $!jsonSet[inputhttpquery;query;$env[query]]
    ]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://m.youtube.com/youtubei/v1/search?prettyPrint=false&fields=$if[$env[contentId]!=;continuationContents.sectionListContinuation(contents.itemSectionRenderer.contents.videoRenderer(videoId,detailedMetadataSnippets,title(runs/text),richThumbnail(movingThumbnailRenderer/movingThumbnailDetails/thumbnails/url),lengthText(simpleText)),continuations(nextContinuationData/continuation)),onResponseReceivedCommands(appendContinuationItemsAction(continuationItems(itemSectionRenderer.contents.videoRenderer(videoId,detailedMetadataSnippets,title(runs/text),richThumbnail(movingThumbnailRenderer/movingThumbnailDetails/thumbnails/url),lengthText(simpleText)),continuationItemRenderer(continuationEndpoint(continuationCommand(token))))));contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer(contents.itemSectionRenderer.contents.videoRenderer(videoId,detailedMetadataSnippets,title(runs/text),richThumbnail(movingThumbnailRenderer/movingThumbnailDetails/thumbnails/url),lengthText(simpleText)),continuations(nextContinuationData/continuation))];POST;res]
    $jsonLoad[res;$env[res]]
    $if[$env[res;continuationContents]!=;
    $jsonLoad[dofetch;$env[res;continuationContents;sectionListContinuation;contents;0;itemSectionRenderer;contents]]
    $let[conToken;$env[res;continuationContents;sectionListContinuation;continuations;0;nextContinuationData;continuation]]
    ;
    $jsonLoad[dofetch;$env[res;contents;twoColumnSearchResultsRenderer;primaryContents;sectionListRenderer;contents;0;itemSectionRenderer;contents]]
    $let[conToken;$env[res;contents;twoColumnSearchResultsRenderer;primaryContents;sectionListRenderer;continuations;0;nextContinuationData;continuation]]
    ]
    $arrayForEach[dofetch;getfetch;
    $if[$and[$env[getfetch;videoRenderer;videoId]!=;$startsWith[$env[getfetch;videoRenderer;detailedMetadataSnippets;0;snippetText;runs;0;text];Provided to YouTube by]==false];
    $letSum[trackresult;1]
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;videoRenderer;title;runs;0;text]]
    $!jsonSet[tempres;duration;"$round[$divide[$unparseDigital[$env[getfetch;videoRenderer;lengthText;simpleText]];1000];0]"]
    $!jsonSet[tempres;thumbnail;$default[$env[getfetch;videoRenderer;richThumbnail;movingThumbnailRenderer;movingThumbnailDetails;thumbnails;0;url];https://i.ytimg.com/vi_webp/$env[getfetch;videoRenderer;videoId]/hq720.webp]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;videoRenderer;videoId]]
    $arrayPushJSON[results;$env[tempres]]]
    ]
    $if[$and[$isNumber[$env[limit]];$get[conToken]!=;$get[trackresult]<$get[limitres]];$callLocalFunction[$get[rrmnsnfc];$get[conToken]]]
    ]
    ;contentId]
    $callLocalFunction[$get[rrmnsnfc];]
    $if[$isNumber[$env[limit]];$arraySlice[results;results;0;$env[limit]]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
},
{
    name: "ytMusic",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    },{
        name: "limit", // number
        description: "Limit results",
        required: false
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $let[limitres;$if[$isNumber[$env[limit]]==false;20;$env[limit]]]
    $let[trackresult;0]
    $let[rrmnsnfc;$randomString[16]]
    $arrayLoad[results]
    $localFunction[$get[rrmnsnfc];
    $try[
    $jsonLoad[inputhttpquery;{"params":"EgWKAQIIAWoQEAMQCRAFEAQQChAVEBAQEQ%3D%3D","context":{"client":{"clientName":67,"clientVersion":"1.20261231","hl":"en","gl":"US"}}}]
    $if[$env[contentId]!=;
    $!jsonSet[inputhttpquery;continuation;$env[contentId]]
    $!jsonDelete[inputhttpquery;params]
    ;
    $!jsonSet[inputhttpquery;query;$env[query]]
    ]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://music.youtube.com/youtubei/v1/search?prettyPrint=false&fields=$if[$env[contentId]!=;continuationContents.musicShelfContinuation(contents.musicResponsiveListItemRenderer(flexColumns(musicResponsiveListItemFlexColumnRenderer(text(runs(text,navigationEndpoint(watchEndpoint/videoId))))),thumbnail(musicThumbnailRenderer(thumbnail(thumbnails(url))))),continuations(nextContinuationData/continuation));contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(contents.musicResponsiveListItemRenderer(flexColumns(musicResponsiveListItemFlexColumnRenderer(text(runs(text,navigationEndpoint(watchEndpoint/videoId))))),thumbnail(musicThumbnailRenderer(thumbnail(thumbnails(url))))),continuations(nextContinuationData/continuation))];POST;res]
    $jsonLoad[res;$env[res]]
    $if[$env[res;continuationContents]!=;
    $jsonLoad[dofetch;$env[res;continuationContents;musicShelfContinuation;contents]]
    $let[conToken;$env[res;continuationContents;musicShelfContinuation;continuations;0;nextContinuationData;continuation]]
    ;
    $jsonLoad[testfetch;$env[res;contents;tabbedSearchResultsRenderer;tabs;0;tabRenderer;content;sectionListRenderer;contents]]
    $jsonLoad[dofetch;$env[res;contents;tabbedSearchResultsRenderer;tabs;0;tabRenderer;content;sectionListRenderer;contents;$arrayFindIndex[testfetch;resfetch;$checkCondition[$env[resfetch;musicShelfRenderer]!=]];musicShelfRenderer;contents]]
    $let[conToken;$env[res;contents;tabbedSearchResultsRenderer;tabs;0;tabRenderer;content;sectionListRenderer;contents;0;musicShelfRenderer;continuations;0;nextContinuationData;continuation]]
    ]
    $arrayForEach[dofetch;getfetch;
    $if[$env[getfetch;musicResponsiveListItemRenderer;flexColumns;0;musicResponsiveListItemFlexColumnRenderer;text;runs;0;navigationEndpoint;watchEndpoint;videoId]!=;
    $letSum[trackresult;1]
    $jsonLoad[a;$env[getfetch;musicResponsiveListItemRenderer;flexColumns;1;musicResponsiveListItemFlexColumnRenderer;text;runs]]
    $let[finduration;$sub[$arrayLength[a];1]]
    $jsonLoad[cleanytmusictitle;$env[getfetch;musicResponsiveListItemRenderer;flexColumns;1;musicResponsiveListItemFlexColumnRenderer;text;runs]]
    $arraySlice[cleanytmusictitle;cleanytmusictitle;0;-4]
    $arrayMap[cleanytmusictitle;yt;$return[$env[yt;text]];cleanytmusictitle]
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$arrayJoin[cleanytmusictitle;] - $env[getfetch;musicResponsiveListItemRenderer;flexColumns;0;musicResponsiveListItemFlexColumnRenderer;text;runs;0;text]]
    $!jsonSet[tempres;duration;"$round[$divide[$unparseDigital[$env[getfetch;musicResponsiveListItemRenderer;flexColumns;1;musicResponsiveListItemFlexColumnRenderer;text;runs;$get[finduration];text]];1000];0]"]
    $!jsonSet[tempres;thumbnail;$advancedTextSplit[$env[getfetch;musicResponsiveListItemRenderer;thumbnail;musicThumbnailRenderer;thumbnail;thumbnails;0;url];=;0]=s0]
    $!jsonSet[tempres;url;https://music.youtube.com/watch?v=$env[getfetch;musicResponsiveListItemRenderer;flexColumns;0;musicResponsiveListItemFlexColumnRenderer;text;runs;0;navigationEndpoint;watchEndpoint;videoId]]
    $arrayPushJSON[results;$env[tempres]]
    ]]
    $if[$and[$isNumber[$env[limit]];$get[conToken]!=;$get[trackresult]<$get[limitres]];$callLocalFunction[$get[rrmnsnfc];$get[conToken]]]
    ]
    ;contentId]
    $callLocalFunction[$get[rrmnsnfc];]
    $if[$isNumber[$env[limit]];$arraySlice[results;results;0;$env[limit]]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
},
{
    name: "ytVideoTv",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    },{
        name: "limit", // number
        description: "Limit results",
        required: false
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $let[limitres;$if[$isNumber[$env[limit]]==false;20;$env[limit]]]
    $let[trackresult;0]
    $let[rrmnsnfc;$randomString[16]]
    $arrayLoad[results]
    $localFunction[$get[rrmnsnfc];
    $try[
    $jsonLoad[inputhttpquery;{"context":{"client":{"clientName":7,"clientVersion":"7.20261231","hl":"en","gl":"US"}}}]
    $if[$env[contentId]!=;
    $!jsonSet[inputhttpquery;continuation;$env[contentId]]
    ;
    $!jsonSet[inputhttpquery;query;$env[query]]
    ]
    $!jsonSet[inputhttpquery;isPrefetch;true]
    $!jsonSet[inputhttpquery;isZeroPrefixQuery;false]
    $!jsonSet[inputhttpquery;suggestionSearchParams;{}]
    $!jsonSet[inputhttpquery;suggestionSearchParams;subtypes;[\\]]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://m.youtube.com/youtubei/v1/search?prettyPrint=false&fields=$if[$env[contentId]!=;continuationContents.sectionListContinuation.contents.shelfRenderer.content.horizontalListRenderer(items,continuations(nextContinuationData/continuation));contents.sectionListRenderer.contents.shelfRenderer.content.horizontalListRenderer(items,continuations(nextContinuationData/continuation))];POST;res]
    $jsonLoad[res;$env[res]]
    $if[$env[res;continuationContents]!=;
    $jsonLoad[dofetch;$env[res;continuationContents;sectionListContinuation;contents;0;shelfRenderer;content;horizontalListRenderer;items]]
    $let[conToken;$env[res;continuationContents;sectionListContinuation;contents;0;shelfRenderer;content;horizontalListRenderer;continuations;0;nextContinuationData;continuation]]
    ;
    $jsonLoad[dofetch;$env[res;contents;sectionListRenderer;contents;0;shelfRenderer;content;horizontalListRenderer;items]]
    $let[conToken;$env[res;contents;sectionListRenderer;contents;0;shelfRenderer;content;horizontalListRenderer;continuations;0;nextContinuationData;continuation]]
    ]
    $arrayForEach[dofetch;getfetch;
    $if[$env[getfetch;lockupViewModel;contentId]!=;
    $if[$or[$env[getfetch;lockupViewModel;contentType]==LOCKUP_CONTENT_TYPE_MUSIC;$env[getfetch;lockupViewModel;contentType]==LOCKUP_CONTENT_TYPE_VIDEO];
    $letSum[trackresult;1]
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;lockupViewModel;metadata;lockupMetadataViewModel;title;content]]
    $!jsonSet[tempres;duration;"$if[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays]==;-1;$round[$divide[$unparseDigital[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays;0;thumbnailBottomOverlayViewModel;badges;0;thumbnailBadgeViewModel;text]];1000];0]]"]
    $!jsonSet[tempres;thumbnail;$if[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays]!=;https://i.ytimg.com/vi_webp/$env[getfetch;lockupViewModel;contentId]/hq720.webp;$advancedTextSplit[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;image;sources;0;url];=;0]=s0]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;lockupViewModel;contentId]]
    $arrayPushJSON[results;$env[tempres]]
    ]
    ;
    $if[$and[$env[getfetch;tileRenderer;contentType]==TILE_CONTENT_TYPE_VIDEO;$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]!=];
    $letSum[trackresult;1]
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;subtitle;simpleText] - $env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;title;simpleText]]
    $!jsonSet[tempres;duration;"$if[$and[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;0;thumbnailOverlayTimeStatusRenderer;text;simpleText]==;$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;1;thumbnailOverlayTimeStatusRenderer;style]!=LIVE];-1;$round[$divide[$unparseDigital[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;0;thumbnailOverlayTimeStatusRenderer;text;simpleText]];1000];0]]"]
    $!jsonSet[tempres;thumbnail;$if[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays]!=;https://i.ytimg.com/vi_webp/$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]/hq720.webp;$advancedTextSplit[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnail;thumbnails;0;url];=;0]=s0]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]]
    $arrayPushJSON[results;$env[tempres]]]
    ]]
    $if[$and[$isNumber[$env[limit]];$get[conToken]!=;$get[trackresult]<$get[limitres]];$callLocalFunction[$get[rrmnsnfc];$get[conToken]]]
    ]
    ;contentId]
    $callLocalFunction[$get[rrmnsnfc];]
    $if[$isNumber[$env[limit]];$arraySlice[results;results;0;$env[limit]]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
}]
