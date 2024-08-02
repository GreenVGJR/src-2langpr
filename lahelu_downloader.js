/* Support Video & Image */
module.exports = {
   name: "lh-d",
   type: "messageCreate",
   code: `$onlyIf[$message[0]!=;$reply $nomention Usage: \`lh-d <url>\`]
   $onlyIf[$checkContains[$message[0];https://lahelu.com/post/;https://www.lahelu.com/post/;www.lahelu.com/post/;lahelu.com/post/];$reply $nomention Usage: \`lh-d <url>\`]
   $onlyIf[$advancedTextSplit[$message[0];lahelu.com/post/;1]!=;$reply $nomention \`VideoID doesn't exist.\`]
   $httpAddHeader[User-Agent;Mozilla/5.0 (Windows; U; Windows NT 10.0; Win64; x64; en-US) AppleWebKit/603.4 (KHTML, like Gecko) Chrome/48.0.2659.283 Safari/534]
   $let[mid;$sendMessage[$channelID;$reply $nomention Getting Info.;true]]
   $let[sreshp;true]
   $let[count;1]
   $while[$get[sreshp];
   $let[http;$httpRequest[https://lahelu.com/api/post/get?postID=$advancedTextSplit[$message[0];lahelu.com/post/;1];GET;reshttp]]
   $onlyIf[$get[http]==200;$!editMessage[$channelID;$get[mid];$nomention ($get[http]) Something just happened.]]
   $if[$env[reshttp]=={};$onlyIf[$get[count]!=3;$!editMessage[$channelID;$get[mid];$nomention No video we're found.] $break] $!editMessage[$channelID;$get[mid];$nomention Getting Info. ($get[count] - Re-trying)] $letSum[count;1];$let[sreshp;false] $break]
   ]
   $!editMessage[$channelID;$get[mid];
   $nomention
   $author[$env[reshttp;postInfo;userUsername];https://cache.lahelu.com/$env[reshttp;postInfo;userAvatar]]
   $title[$env[reshttp;postInfo;title]]
   $description[\`Uploading.\`]
   $footer[U: $env[reshttp;postInfo;totalUpvotes] | D: $env[reshttp;postInfo;totalDownvotes] | C: $env[reshttp;postInfo;totalComments]]
   $timestamp[$env[reshttp;postInfo;createTime]]
   $addActionRow
   $addButton[https://cache.lahelu.com/$env[reshttp;postInfo;media];Download;Link;;false]
   ]
   $!editMessage[$channelID;$get[mid];
   $nomention
   $attachment[https://cache.lahelu.com/$env[reshttp;postInfo;media];lahelu-$env[reshttp;postInfo;postID].$if[$checkContains[$env[reshttp;postInfo;media];video-];mp4;png]]
   $author[$env[reshttp;postInfo;userUsername];https://cache.lahelu.com/$env[reshttp;postInfo;userAvatar]]
   $title[$env[reshttp;postInfo;title]]
   $footer[U: $env[reshttp;postInfo;totalUpvotes] | D: $env[reshttp;postInfo;totalDownvotes] | C: $env[reshttp;postInfo;totalComments]]
   $timestamp[$env[reshttp;postInfo;createTime]]
   $addActionRow
   $addButton[https://cache.lahelu.com/$env[reshttp;postInfo;media];Download;Link;;false]
   ]`
}
