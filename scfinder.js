module.exports = [{
   //Basic Command
   name: "sc-search",
   type: "messageCreate",
   code: `$onlyIf[$message[0]!=;$reply $nomention what you want search]
   $let[clientid;$getVar[sc-clientid;$botID]]
   $let[mid;$sendMessage[$channelID;_ _ $reply $nomention;true]]
   $let[con;$httpRequest[https://api-v2.soundcloud.com/search/tracks?q=$encodeURI[$message]&client_id=$get[clientid]&limit=25&linked_partitioning=true;GET;val]]
   $onlyIf[$get[con]==200;$let[cs;$editMessage[$channelID;$get[mid];Status code: $get[con] $nomention]]]
   $onlyIf[$env[val;total_results]!=0;$let[cs;$editMessage[$channelID;$get[mid];Status code: $get[con] -> 404 $nomention]]]
   $let[toc;$env[val;total_results]]
   $let[idc;0]
   $let[cs;$editMessage[$channelID;$get[mid];
   $nomention
   $addActionRow
   $addStringSelectMenu[selres;Tracks;false;1;1]
   $while[$charCount[$env[val;collection;$get[idc]]]!=0;$let[text;$env[val;collection;$get[idc];title]] $addOption[$cropText[$get[text];0;100];$trunc[$divide[$env[val;collection;$get[idc];full_duration];60000]]m $trunc[$modulo[$divide[$env[val;collection;$get[idc];full_duration];1000];60]]s - $if[$env[val;collection;$get[idc];publisher_metadata;artist]==;null;$env[val;collection;$get[idc];publisher_metadata;artist]];$env[val;collection;$get[idc];id]_$authorID] $let[idc;$sum[$get[idc];1]]]
   $addActionRow
   $addButton[curtrack_$authorID_1_$if[$get[toc]>25;$trunc[$divide[$get[toc];$get[idc]]];1];Page 1 - $if[$get[toc]>25;$trunc[$divide[$get[toc];$get[idc]]];1];Primary;;$checkCondition[$get[toc]<25]]
   $addField[Results;$separateNumber[$get[toc];.];true]
   $if[$get[toc]>25;$addField[Filtered ($separateNumber[$trunc[$divide[$get[toc];$get[idc]]];.]);$get[idc];true]]
   $addField[Requested By;<@$authorID>;true]
   $color[a09fff]
   $timestamp
   $thumbnail[$if[$env[val;collection;0;artwork_url]==null;$userAvatar[$botID]&;$replace[$env[val;collection;0;artwork_url];-large.jpg;-t500x500.jpg]?iscaptcha=false&]content=$encodeURI[$message]]
   ]]`
},
{
   //Pages Modal Interaction
   type: "interactionCreate",
   allowedInteractionTypes: ["button"],
   code: `$arrayLoad[ls;_;$customID]
   $onlyIf[$arrayAt[ls;0]==curtrack;]
   $onlyIf[$arrayAt[ls;1]==$authorID;]
   $modal[applypage_$authorID_$arrayAt[ls;2]_$arrayAt[ls;3];Pages $arrayAt[ls;2] - $arrayAt[ls;3]]
   $addTextInput[curpage;input;Short;true;;$arrayAt[ls;2];1;$charCount[$arrayAt[ls;3]]]`
},
{
   //Modal Interaction to Results
   type: "interactionCreate",
   allowedInteractionTypes: ["modal"],
   code: `$arrayLoad[ls;_;$customID]
   $onlyIf[$arrayAt[ls;0]==applypage;]
   $onlyIf[$arrayAt[ls;1]==$authorID;]
   $onlyIf[$multi[$input[curpage];1]!=$multi[$arrayAt[ls;2];1];$deferUpdate]
   $onlyIf[$multi[$arrayAt[ls;3];1]>=$multi[$input[curpage];1];$deferUpdate]
   $deferUpdate
   $arrayLoad[content;&content=;$getEmbed[$channelID;$messageID;0;thumbnail]]
   $let[off;25]
   $let[current;$arrayAt[ls;3]]
   $let[clientid;$getVar[sc-clientid;$botID]]
   $let[con;$httpRequest[https://api-v2.soundcloud.com/search/tracks?q=$arrayAt[content;1]&offset=$sub[$multi[$get[off];$input[curpage]];$get[off]]&client_id=$get[clientid]&limit=25&linked_partitioning=true;GET;val]]
   $onlyIf[$get[con]==200;$sendMessage[$channelID;$reply[$channelID;$messageID] Status code: $get[con];false]]
   $onlyIf[$env[val;total_results]!=0;$interactionUpdate[$description[Status code: $get[con] -> 404\n\nTarget Page: $input[curpage]] $thumbnail[$getEmbed[$channelID;$messageID;0;thumbnail]] $timestamp $color[a09fff] $fetchRows[$channelID;$messageID]]]
   $let[toc;$env[val;total_results]]
   $let[idc;0]
   $interactionUpdate[
      $addActionRow
      $addStringSelectMenu[selres;Tracks;false;1;1]
      $while[$charCount[$env[val;collection;$get[idc]]]!=0;$let[text;$env[val;collection;$get[idc];title]] $addOption[$cropText[$get[text];0;100];$trunc[$divide[$env[val;collection;$get[idc];full_duration];60000]]m $trunc[$modulo[$divide[$env[val;collection;$get[idc];full_duration];1000];60]]s - $if[$env[val;collection;$get[idc];publisher_metadata;artist]==;null;$env[val;collection;$get[idc];publisher_metadata;artist]];$env[val;collection;$get[idc];id]_$authorID] $let[idc;$sum[$get[idc];1]]]
      $addActionRow
      $addButton[curtrack_$authorID_$input[curpage]_$if[$get[toc]>25;$arrayAt[ls;3];1];Page $input[curpage] - $if[$get[toc]>25;$arrayAt[ls;3];1];Primary;;false]
      $addField[Results;$separateNumber[$get[toc];.];true]
      $if[$get[toc]>25;$addField[Filtered ($arrayAt[ls;3]);$get[idc];true]]
      $addField[Requested By;<@$authorID>;true]
      $color[a09fff]
      $timestamp
      $thumbnail[$if[$env[val;collection;0;artwork_url]==null;$userAvatar[$botID]&;$replace[$env[val;collection;0;artwork_url];-large.jpg;-t500x500.jpg]?iscaptcha=false&]content=$arrayAt[content;1]]
   ]`
},
{
   //Interaction to Results Search/Query
   name: "selres",
   type: "interactionCreate",
   allowedInteractionTypes: ["selectMenu"],
   code: `$ephemeral
   $defer
   $arrayLoad[idc;_;$selectMenuValues[0]]
   $let[trackid;$arrayAt[idc;0]]
   $onlyIf[$arrayAt[idc;1]==$authorID;]
   $let[clientid;$getVar[sc-clientid;$botID]]
   $interactionFollowUp[
   $color[a09fff]
   $timestamp
   $footer[Requesting.]
   $addActionRow
   $addButton[down1;RAW Data;Secondary;📋;true]
   $addActionRow
   $addButton[down2;Download Cover;Success;🖼;true]
   $addActionRow
   $addButton[down3;Download Track;Primary;🎶;true]
   ]
   $let[con;$httpRequest[https://api-v2.soundcloud.com/tracks/$get[trackid]?client_id=$get[clientid];GET;val]]
   $onlyIf[$get[con]==200;$interactionUpdate[Status code: $get[con]]]
   $if[$env[val;full_duration]>=360000;$let[cons;$httpRequest[$env[val;media;transcodings;1;url]?client_id=$get[clientid];GET;curl]]]
   $interactionUpdate[
   $if[$env[val;artwork_url]!=null;$thumbnail[$replace[$env[val;artwork_url];-large.jpg;-t500x500.jpg]]]
   $title[$env[val;title];$env[val;permalink_url]]
   $addField[Duration;\`$trunc[$divide[$env[val;full_duration];60000]]m $trunc[$modulo[$divide[$env[val;full_duration];1000];60]]s\`;true]
   $addField[Genre;\`$if[$env[val;genre]==;(undefined);$env[val;genre]]\`;true]
   $addField[ID;\`$env[val;id]\`;true]
   $addField[Audio;\\[Link\\]($if[$env[curl]==;$env[val;media;transcodings;1;url];$env[curl;url]]);true]
   $addField[Cover;$if[$env[val;artwork_url]==null;null;\\[Link\\]($replace[$env[val;artwork_url];-large.jpg;-t500x500.jpg])];true]
   $timestamp
   $color[a09fff]
   $addActionRow
   $addButton[rawsc_$env[val;id]_$authorID;RAW Data;Secondary;📋;false]
   $addActionRow
   $addButton[coversc_$env[val;id]_$authorID;Download Cover;Success;🖼;$checkCondition[$env[val;artwork_url]==null]]
   $addActionRow
   $addButton[tracksc_$env[val;id]_$authorID;Download Track$if[$env[val;duration]==30000; (Preview);$if[$env[val;media;transcodings;1;format;protocol]==hls; (Restricted);];];Primary;🎶;$checkCondition[$env[val;full_duration]>=360000]]
   ]`
},
{
   //Track Download Interaction
   type: "interactionCreate",
   allowedInteractionTypes: ["button"],
   code: `$arrayLoad[idc;_;$customID]
   $onlyIf[$arrayAt[idc;0]==tracksc;]
   $onlyIf[$arrayAt[idc;2]==$authorID;]
   $ephemeral
   $defer
   $let[clientid;$getVar[sc-clientid;$botID]]
   $interactionFollowUp[Requesting.]
   $let[con;$httpRequest[https://api-v2.soundcloud.com/tracks/$arrayAt[idc;1]?client_id=$get[clientid];GET;val]]
   $onlyIf[$get[con]==200;$interactionUpdate[Status code: $get[con]]]
   $if[$env[val;media;transcodings;1;format;protocol]==hls;$function[
   $interactionUpdate[Requesting. (2nd Attempts)]
   $let[cons;$httpRequest[$env[val;media;transcodings;0;url]?client_id=$get[clientid]&track_authorization=$env[val;track_authorization];GET;vals]]
   $onlyIf[$get[cons]==200;$interactionUpdate[Status code: $get[cons]]]
   $if[$checkContains[$env[vals;url];playlist.m3u8]==true;$function[
   $interactionUpdate[Requesting. (3rd Attempts)]
   $let[final;$httpRequest[$env[vals;url];GET;finals]]
   $onlyIf[$get[final]==200;$interactionUpdate[Status code: $get[final]]]
   $arrayLoad[vlk;
;$env[finals]]
   $onlyIf[$checkContains[$arrayAt[vlk;6];https://cf-hls-media.sndcdn.com/media/]==true;$interactionUpdate[Status code: $get[final] -> 403]]
   $interactionUpdate[Downloading.]
   $interactionUpdate[$attachment[$arrayAt[vlk;6];$env[val;title].mp3]]
   $stop
      ]
   ]
   $interactionUpdate[Downloading.]
   $interactionUpdate[$attachment[$env[vals;url];$env[val;title].mp3]]
   ];$function[
   $let[cons;$httpRequest[$env[val;media;transcodings;1;url]?client_id=$get[clientid];GET;vals]]
   $onlyIf[$get[cons]==200;$interactionUpdate[Status code: $get[cons]]]
   $interactionUpdate[Downloading.]
   $interactionUpdate[$attachment[$env[vals;url];$env[val;title].mp3]]
      ]
   ]`
},
{
   //Cover Download Interaction
   type: "interactionCreate",
   allowedInteractionTypes: ["button"],
   code: `$arrayLoad[idc;_;$customID]
   $onlyIf[$arrayAt[idc;0]==coversc;]
   $onlyIf[$arrayAt[idc;2]==$authorID;]
   $ephemeral
   $defer
   $interactionFollowUp[$attachment[$getEmbed[$channelID;$messageID;0;thumbnail];?.png]]`
},
{
   //Data Download Interaction
   type: "interactionCreate",
   allowedInteractionTypes: ["button"],
   code: `$arrayLoad[idc;_;$customID]
   $onlyIf[$arrayAt[idc;0]==rawsc;]
   $onlyIf[$arrayAt[idc;2]==$authorID;]
   $let[clientid;$getVar[sc-clientid;$botID]]
   $ephemeral
   $defer
   $let[con;$httpRequest[https://api-v2.soundcloud.com/tracks/$arrayAt[idc;1]?client_id=$get[clientid];GET;val]]
   $onlyIf[$get[con]==200;$interactionUpdate[Status code: $get[con]]]
   $interactionUpdate[$attachment[$env[val];?.json;true]]`
}]
