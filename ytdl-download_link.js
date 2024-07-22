/*
Require '@distube/ytdl-core' package for this command.

If you cant install then you need "git" to install it.
*/

module.exports = [{
   name: "yt-d",
   type: "messageCreate",
   code: `$let[filter_v-id;$if[$checkCondition[$advancedTextSplit[$message[0];watch?v=;1]==];$if[$checkCondition[$advancedTextSplit[$message[0];youtu.be/;1]==];$if[$checkCondition[$advancedTextSplit[$message[0];youtube.com/shorts/;1]==];null;$advancedTextSplit[$message[0];youtube.com/shorts/;1]];$advancedTextSplit[$message[0];youtu.be/;1]];$advancedTextSplit[$message[0];watch?v=;1]]]
   $onlyIf[$get[filter_v-id]!=null;$reply[$channelID;$messageID;true] Usage: \`yt-d <youtube_url>\`]
   $let[mid;$sendMessage[$channelID;
   $reply[$channelID;$messageID;true]
   $color[a09fff;0]
   $color[9c3e3e;1]
   $c[-- Getting First Parameter --]
   $let[filter_v-id;$replaceRegex[$get[filter_v-id];(?:\\\[?&\\\]|\\\\b)(\\\[^&=#<>\\\]+)=(\\\[^&=#<>\\\]+);g;]]
   $image[https://i.ytimg.com/vi/$get[filter_v-id]/maxresdefault.jpg;0]
   $footer[Fetching video.;https://cdn.discordapp.com/emojis/1263537498127204433.gif?size=4096;0]
   $timestamp[;1]
   $footer[Response results will be appear here.;;1]
   ;true]]
   $onlyIf[$djsEval[require('@distube/ytdl-core').validateID(ctx.getKeyword('filter_v-id'))];$!editMessage[$channelID;$get[mid];$nomention Invalid Video ID.\n-# Status Code: 404 | VideoID: $get[filter_v-id]]]
   $let[data;$djsEval[
      const ytdl = require('@distube/ytdl-core');

      async function getAudioFormats() {
      try {
         const vid = ctx.getKeyword('filter_v-id');
         let info = await ytdl.getInfo(vid);
         let va_formats = ytdl.filterFormats(info.formats, 'videoandaudio');
         let a_formats = ytdl.filterFormats(info.formats, 'audioonly');
         let v_formats = ytdl.filterFormats(info.formats, 'videoonly');
         return JSON.stringify({
            formats: {
                video_audio: va_formats,
                video: v_formats,
                audio: a_formats
            },
            videoDetails: info.videoDetails
        });
      } catch (error) {
         console.log(error);
         return null;
         }
      }

      (async () => {
         try {
            let result = await getAudioFormats();
            return result;
         } catch (error) {
            console.log(error);
            return null;
            }
         })
      ();
   ]
]
   $onlyIf[$trim[$get[data]]!=undefined;$!editMessage[$channelID;$get[mid];$nomention Can't fetch this video.\n-# Status Code: 403 | VideoID: $get[filter_v-id]]]
   $jsonLoad[videoDetails;$get[data]]
   $!editMessage[$channelID;$get[mid];
   $nomention
   $attachment[$env[videoDetails];ytdl-$getTimestamp_$get[mid].json;true]
   $author[$env[videoDetails;videoDetails;ownerChannelName];;$env[videoDetails;videoDetails;ownerProfileUrl]]
   $description[\\[\`$env[videoDetails;videoDetails;title]\`\\](https://www.youtube.com/watch?v=$get[filter_v-id] "YouTube - @$env[videoDetails;videoDetails;ownerChannelName]")]
   $addField[Duration;\`$if[$env[videoDetails;videoDetails;isLive];LIVE;$djsEval[new Date($env[videoDetails;videoDetails;lengthSeconds] * 1000).toISOString().substr(11, 8)]]\`;true]
   $addField[Upload Date;<t:$djsEval[Math.floor(new Date('$env[videoDetails;videoDetails;uploadDate]').getTime() / 1000)]:F>;true]
   $addField[Views;\`$separateNumber[$env[videoDetails;videoDetails;viewCount]]\`;true]
   $addField[Expire;<t:$advancedTextSplit[$env[videoDetails;formats;audio;0;url];videoplayback?expire=;1;&;0]:R>;true]
   $addField[Target Host;\`$if[$checkContains[$djsEval[decodeURIComponent("$advancedTextSplit[$env[videoDetails;formats;audio;0;url];&ip=;1;&;0]")];.];IPv4;IPv6]\`;true]
   $thumbnail[https://i.ytimg.com/vi/$get[filter_v-id]/maxresdefault.jpg]
   $color[9c3e3e]
   $timestamp
   $footer[$env[videoDetails;videoDetails;category]]
   $if[$checkCondition[$env[videoDetails;formats;video_audio;0;itag]!=];
   $let[count;0]
   $addActionRow
   $addStringSelectMenu[va_formats;Video (with Audio)]
   $while[$checkCondition[$env[videoDetails;formats;video_audio;$get[count];itag]!=];$addOption[$if[$env[videoDetails;formats;video_audio;$get[count];isHLS];(HLS);$if[$env[videoDetails;formats;video_audio;$get[count];isDashMPD];(DASH)]] $env[videoDetails;formats;video_audio;$get[count];qualityLabel] ($trunc[$divide[$env[videoDetails;formats;video_audio;$get[count];contentLength];1048576]] MB);$env[videoDetails;formats;video_audio;$get[count];videoCodec] & $env[videoDetails;formats;video_audio;$get[count];audioCodec];tdc_$env[videoDetails;formats;video_audio;$get[count];itag]_$authorID_$get[count]_$get[mid]] $letSum[count;1]]
   ]
   $let[count;0]
   $addActionRow
   $addStringSelectMenu[v_formats;Video]
   $while[$checkCondition[$env[videoDetails;formats;video;$get[count];itag]!=];$addOption[$if[$env[videoDetails;formats;video;$get[count];isHLS];(HLS);$if[$env[videoDetails;formats;video;$get[count];isDashMPD];(DASH)]] $env[videoDetails;formats;video;$get[count];qualityLabel] - $env[videoDetails;formats;video;$get[count];fps]fps ($trunc[$divide[$env[videoDetails;formats;video;$get[count];contentLength];1048576]] MB);$env[videoDetails;formats;video;$get[count];videoCodec];tdc_$env[videoDetails;formats;video;$get[count];itag]_$authorID_$get[count]_$get[mid]] $letSum[count;1] $if[$get[count]>=24;$break]]
   $if[$get[count]>=24;$addActionRow
   $addStringSelectMenu[v_formats-1;Video #2]
   $while[$checkCondition[$env[videoDetails;formats;video;$get[count];itag]!=];$addOption[$if[$env[videoDetails;formats;video;$get[count];isHLS];(HLS);$if[$env[videoDetails;formats;video;$get[count];isDashMPD];(DASH)]] $env[videoDetails;formats;video;$get[count];qualityLabel] - $env[videoDetails;formats;video;$get[count];fps]fps ($trunc[$divide[$env[videoDetails;formats;video;$get[count];contentLength];1048576]] MB);$env[videoDetails;formats;video;$get[count];videoCodec];tdc_$env[videoDetails;formats;video;$get[count];itag]_$authorID_$get[count]_$get[mid]] $letSum[count;1]]
   ]
   $let[count;0]
   $addActionRow
   $addStringSelectMenu[a_formats;Audio]
   $while[$checkCondition[$env[videoDetails;formats;audio;$get[count];itag]!=];$addOption[$if[$env[videoDetails;formats;audio;$get[count];isHLS];(HLS);$if[$env[videoDetails;formats;audio;$get[count];isDashMPD];(DASH)]] $env[videoDetails;formats;audio;$get[count];audioBitrate]kb ($trunc[$divide[$env[videoDetails;formats;audio;$get[count];contentLength];1048576]] MB) $if[$env[videoDetails;formats;audio;$get[count];isDrc];- Stable Volume];$env[videoDetails;formats;audio;$get[count];audioCodec];tdc_$env[videoDetails;formats;audio;$get[count];itag]_$authorID_$get[count]_$get[mid]$if[$env[videoDetails;formats;audio;$get[count];isDrc];_drc]] $letSum[count;1]]
   ]
   $wait[10000]
   $if[$charCount[$getEmbeds[$channelID;$get[mid];0;image]]!=0;$!editMessage[$channelID;$get[mid];$nomention Something just happened.\n-# Status Code: 400 | VideoID: $get[filter_v-id]] $stop]`
},
{
   type: "interactionCreate",
   allowedInteractionTypes: ["selectMenu"],
   code: `$onlyIf[$checkContains[$customID;a_formats;v_formats;v_formats-1;va_formats];]
   $onlyIf[$advancedTextSplit[$selectMenuValues[0];_;0]==tdc;]
   $onlyIf[$advancedTextSplit[$selectMenuValues[0];_;2]==$authorID;]
   $ephemeral
   $defer
   $let[messageid;$advancedTextSplit[$selectMenuValues[0];_;4]]
   $let[drc;$advancedTextSplit[$selectMenuValues[0];_;5]]
   $let[itag;$advancedTextSplit[$selectMenuValues[0];_;1]]
   $let[chttp;$httpRequest[$messageAttachment[$channelID;$get[messageid];0];GET;reshttp]]
   $onlyIf[$get[chttp]==200;$interactionReply[Can't process this.\n-# Status Code: $get[chttp]]]
   $let[http;$env[reshttp]]
   $let[data;$djsEval[
   let found = null;

   const http = JSON.parse(ctx.getKeyword('http'));
   const itag = ctx.getKeyword('itag');
   const drc = ctx.getKeyword('drc');
   const formatTypes = Object.keys(http.formats);

   for (const type of formatTypes) {
   const formatArray = http.formats\\[type\\];

   let format;
   if (!drc) {
      format = formatArray.find(format => format.itag == itag);
   } else {
      format = formatArray.find(format => format.itag == itag && format.isDrc == true);
   }

   if (format) {
      found = format.url;
      break;
   }
   }

   found;
   ]
]
    $interactionReply[\\[$advancedTextSplit[$get[data];/;2]\\]($decodeURI[$get[data]])]`
}]
