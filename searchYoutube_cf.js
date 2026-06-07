module.exports = [{
    name: "ytVideo",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $arrayLoad[results]
    $try[
    $jsonLoad[inputhttpquery;{"context":{"client":{"clientName":1,"clientVersion":"2.20261231","hl":"en","gl":"US"}}}]
    $!jsonSet[inputhttpquery;query;$env[query]]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://m.youtube.com/youtubei/v1/search?prettyPrint=false&fields=contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.itemSectionRenderer.contents.videoRenderer(videoId,detailedMetadataSnippets,title(runs/text),richThumbnail(movingThumbnailRenderer/movingThumbnailDetails/thumbnails/url),lengthText(simpleText));POST;res]
    $jsonLoad[res;$env[res]]
    $jsonLoad[dofetch;$env[res;contents;twoColumnSearchResultsRenderer;primaryContents;sectionListRenderer;contents;0;itemSectionRenderer;contents]]
    $arrayForEach[dofetch;getfetch;
    $if[$and[$env[getfetch;videoRenderer;videoId]!=;$startsWith[$env[getfetch;videoRenderer;detailedMetadataSnippets;0;snippetText;runs;0;text];Provided to YouTube by]==false];
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;videoRenderer;title;runs;0;text]]
    $!jsonSet[tempres;duration;"$round[$divide[$unparseDigital[$env[getfetch;videoRenderer;lengthText;simpleText]];1000];0]"]
    $!jsonSet[tempres;thumbnail;$default[$env[getfetch;videoRenderer;richThumbnail;movingThumbnailRenderer;movingThumbnailDetails;thumbnails;0;url];https://i.ytimg.com/vi_webp/$env[getfetch;videoRenderer;videoId]/hq720.webp]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;videoRenderer;videoId]]
    $arrayPushJSON[results;$env[tempres]]]
    ]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
},
{
    name: "ytMusic",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $arrayLoad[results]
    $try[
    $jsonLoad[inputhttpquery;{"params":"EgWKAQIIAWoQEAMQCRAFEAQQChAVEBAQEQ%3D%3D","context":{"client":{"clientName":67,"clientVersion":"1.20261231","hl":"en","gl":"US"}}}]
    $!jsonSet[inputhttpquery;query;$env[query]]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://music.youtube.com/youtubei/v1/search?prettyPrint=false&fields=contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer.contents.musicResponsiveListItemRenderer(flexColumns(musicResponsiveListItemFlexColumnRenderer(text(runs(text,navigationEndpoint(watchEndpoint/videoId))))),thumbnail(musicThumbnailRenderer(thumbnail(thumbnails(url)))));POST;res]
    $jsonLoad[res;$env[res]]
    $jsonLoad[testfetch;$env[res;contents;tabbedSearchResultsRenderer;tabs;0;tabRenderer;content;sectionListRenderer;contents]]
    $jsonLoad[dofetch;$env[res;contents;tabbedSearchResultsRenderer;tabs;0;tabRenderer;content;sectionListRenderer;contents;$arrayFindIndex[testfetch;resfetch;$checkCondition[$env[resfetch;musicShelfRenderer]!=]];musicShelfRenderer;contents]]
    $if[$env[dofetch]==;
    $jsonLoad[inputhttpquery;{"context":{"client":{"clientName":1,"clientVersion":"2.20261231","hl":"en","gl":"US"}}}]
    $!jsonSet[inputhttpquery;query;$env[query]]
    $httpSetBody[$jsonStringify[inputhttpquery]]
    $httpSetContentType[Text]
    $httpAddHeader[User-Agent;$get[agent]]
    $httpAddHeader[Accept-Encoding;gzip, br]
    $httpAddHeader[Content-Type;application/json]
    $httpAddHeader[Accept-Language;en]
    $!httpRequest[https://m.youtube.com/youtubei/v1/search?prettyPrint=false&fields=contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.itemSectionRenderer.contents.videoRenderer(videoId,detailedMetadataSnippets,title(runs/text),lengthText(simpleText));POST;res]
    $jsonLoad[res;$env[res]]
    $jsonLoad[dofetch;$env[res;contents;twoColumnSearchResultsRenderer;primaryContents;sectionListRenderer;contents;0;itemSectionRenderer;contents]]
    $arrayForEach[dofetch;getfetch;
    $if[$and[$env[getfetch;videoRenderer;videoId]!=;$startsWith[$env[getfetch;videoRenderer;detailedMetadataSnippets;0;snippetText;runs;0;text];Provided to YouTube by]];
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;videoRenderer;title;runs;0;text]]
    $!jsonSet[tempres;duration;"$round[$divide[$unparseDigital[$env[getfetch;videoRenderer;lengthText;simpleText]];1000];0]"]
    $!jsonSet[tempres;thumbnail;https://i.ytimg.com/vi/$env[getfetch;videoRenderer;videoId]/maxres1.jpg]
    $!jsonSet[tempres;url;https://music.youtube.com/watch?v=$env[getfetch;videoRenderer;videoId]]
    $arrayPushJSON[results;$env[tempres]]
    ]]
    ;
    $arrayForEach[dofetch;getfetch;
    $if[$env[getfetch;musicResponsiveListItemRenderer;flexColumns;0;musicResponsiveListItemFlexColumnRenderer;text;runs;0;navigationEndpoint;watchEndpoint;videoId]!=;
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
    ]]]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
},
{
    name: "ytVideoTv",
    params: [{
        name: "query", // string
        description: "Query",
        required: true
    }],
    code: `
    $let[agent;Mozilla/5.0 (X11\\; Linux x86_64\\; rv:151.0) Gecko/20100101 Firefox/151.0]
    $arrayLoad[results]
    $try[
    $jsonLoad[inputhttpquery;{"context":{"client":{"clientName":7,"clientVersion":"7.20261231","hl":"en","gl":"US"}}}]
    $!jsonSet[inputhttpquery;query;$env[query]]
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
    $!httpRequest[https://m.youtube.com/youtubei/v1/search?prettyPrint=false&fields=contents.sectionListRenderer.contents.shelfRenderer.content.horizontalListRenderer.items;POST;res]
    $jsonLoad[res;$env[res]]
    $jsonLoad[dofetch;$env[res;contents;sectionListRenderer;contents;0;shelfRenderer;content;horizontalListRenderer;items]]
    $arrayForEach[dofetch;getfetch;
    $if[$env[getfetch;lockupViewModel;contentId]!=;
    $if[$or[$env[getfetch;lockupViewModel;contentType]==LOCKUP_CONTENT_TYPE_MUSIC;$env[getfetch;lockupViewModel;contentType]==LOCKUP_CONTENT_TYPE_VIDEO];
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;lockupViewModel;metadata;lockupMetadataViewModel;title;content]]
    $!jsonSet[tempres;duration;"$if[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays]==;-1;$round[$divide[$unparseDigital[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays;0;thumbnailBottomOverlayViewModel;badges;0;thumbnailBadgeViewModel;text]];1000];0]]"]
    $!jsonSet[tempres;thumbnail;$if[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;overlays]!=;https://i.ytimg.com/vi_webp/$env[getfetch;lockupViewModel;contentId]/hq720.webp;$advancedTextSplit[$env[getfetch;lockupViewModel;contentImage;thumbnailViewModel;image;sources;0;url];=;0]=s0]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;lockupViewModel;contentId]]
    $arrayPushJSON[results;$env[tempres]]
    ]
    ;
    $if[$and[$env[getfetch;tileRenderer;contentType]==TILE_CONTENT_TYPE_VIDEO;$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]!=];
    $jsonLoad[tempres;{}]
    $!jsonSet[tempres;title;$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;subtitle;simpleText] - $env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;title;simpleText]]
    $!jsonSet[tempres;duration;"$if[$and[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;0;thumbnailOverlayTimeStatusRenderer;text;simpleText]==;$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;1;thumbnailOverlayTimeStatusRenderer;style]!=LIVE];-1;$round[$divide[$unparseDigital[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays;0;thumbnailOverlayTimeStatusRenderer;text;simpleText]];1000];0]]"]
    $!jsonSet[tempres;thumbnail;$if[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnailOverlays]!=;https://i.ytimg.com/vi_webp/$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]/hq720.webp;$advancedTextSplit[$env[getfetch;tileRenderer;header;tileHeaderRenderer;thumbnail;thumbnails;0;url];=;0]=s0]]
    $!jsonSet[tempres;url;https://youtube.com/watch?v=$env[getfetch;tileRenderer;onLongPressCommand;showMenuCommand;contentId]]
    $arrayPushJSON[results;$env[tempres]]]
    ]]]
    $return[{"ping":"$httpPing","results":$jsonStringify[results]}]
    `
}]
