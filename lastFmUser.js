module.exports = {
    name: "lastFmUser",
    params: [{
        name: "rrapikey",
        description: "Last.Fm API Key",
        required: true
    },
    {
        name: "rrquery",
        description: "Username to fetch",
        required: true
    },
    {
        name: "fetchmoderecent",
        description: "Include Recent Tracks (Default: true)",
        type: "boolean",
        required: false
    },
    {
        name: "fetchmodetopartist",
        description: "Include Top Artists (Default: false)",
        type: "boolean",
        required: false
    },
    {
        name: "fetchmodetoptrack",
        description: "Include Top Albums (Default: false)",
        type: "boolean",
        required: false
    },
    {
        name: "fetchmodetopalbum",
        description: "Include Top Albums (Default: false)",
        type: "boolean",
        required: false
    },],
    code: `
$let[rts-apiKey;$env[rrapikey]]
$let[rts-username;$env[rrquery]]

$jsonLoad[rsllslastfm;{}]

$c[Fetch User Info, also do validation]
$try[
$let[statuslcr;$httpRequest[https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=$get[rts-username]&api_key=$get[rts-apiKey]&format=json;GET;rrlrnlastfmuser]]
$if[$env[rrlrnlastfmuser;error]!=;
$!jsonSet[rsllslastfm;error;$env[rrlrnlastfmuser;message]]
$return[$jsonStringify[rsllslastfm]]
]
$!jsonSet[rsllslastfm;user;$env[rrlrnlastfmuser;user]]
;
$!jsonSet[rsllslastfm;error;$env[rrkso-svd-lferr]]
$return[$jsonStringify[rsllslastfm]]
;rrkso-svd-lferr]


$c[Fetch Recent Track / Scrobbling]
$if[$or[$env[fetchmoderecent]==true;$env[fetchmoderecent]==null;$env[fetchmoderecent]==];
$!jsonSet[rsllslastfm;recent_tracks;{}]
$try[
$let[statuslcr;$httpRequest[https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=$get[rts-username]&api_key=$get[rts-apiKey]&format=json;GET;rrlrnlastfmuserrecent]]
$if[$env[rrlrnlastfmuserrecent;error]!=;
$!jsonSet[rsllslastfm;recent_tracks;error;$env[rrlrnlastfmuserrecent;message]]
;
$if[$get[statuslcr]==200;
$!jsonSet[rsllslastfm;recent_tracks;$env[rrlrnlastfmuserrecent;recenttracks;track]]
]]
;
$!jsonSet[rsllslastfm;recent_tracks;error;$env[rrkso-svd-lferr2]]
;rrkso-svd-lferr2]
]


$c[Fetch Top Artists]
$if[$env[fetchmodetopartist]==true;
$!jsonSet[rsllslastfm;top_artists;{}]
$try[
$let[statuslcr;$httpRequest[https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=$get[rts-username]&api_key=$get[rts-apiKey]&period=overall&format=json;GET;rrlrnlastfmtopartists]]
$if[$env[rrlrnlastfmtopartists;error]!=;
$!jsonSet[rsllslastfm;top_artists;error;$env[rrlrnlastfmtopartists;message]]
;
$if[$get[statuslcr]==200;
$!jsonSet[rsllslastfm;top_artists;$env[rrlrnlastfmtopartists;topartists;artist]]
]]
;
$!jsonSet[rsllslastfm;top_artists;error;$env[rrkso-svd-lferr3]]
;rrkso-svd-lferr3]
]


$c[Fetch Top Tracks]
$if[$env[fetchmodetoptrack]==true;
$!jsonSet[rsllslastfm;top_tracks;{}]
$try[
$let[statuslcr;$httpRequest[https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=$get[rts-username]&api_key=$get[rts-apiKey]&period=overall&format=json;GET;rrlrnlastfmtoptracks]]
$if[$env[rrlrnlastfmtoptracks;error]!=;
$!jsonSet[rsllslastfm;top_tracks;error;$env[rrlrnlastfmtoptracks;message]]
;
$if[$get[statuslcr]==200;
$!jsonSet[rsllslastfm;top_tracks;$env[rrlrnlastfmtoptracks;toptracks;track]]
]]
;
$!jsonSet[rsllslastfm;top_tracks;error;$env[rrkso-svd-lferr4]]
;rrkso-svd-lferr4]
]


$c[Fetch Top Albums]
$if[$env[fetchmodetopalbum]==true;
$!jsonSet[rsllslastfm;top_albums;{}]
$try[
$let[statuslcr;$httpRequest[https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=$get[rts-username]&api_key=$get[rts-apiKey]&period=overall&format=json;GET;rrlrnlastfmtopalbums]]
$if[$env[rrlrnlastfmtopalbums;error]!=;
$!jsonSet[rsllslastfm;top_albums;error;$env[rrlrnlastfmtopalbums;message]]
;
$if[$get[statuslcr]==200;
$!jsonSet[rsllslastfm;top_albums;$env[rrlrnlastfmtopalbums;topalbums;album]]
]]
;
$!jsonSet[rsllslastfm;top_albums;error;$env[rrkso-svd-lferr5]]
;rrkso-svd-lferr5]
]

$c[Final Response]
$return[$jsonStringify[rsllslastfm]]
`
}
