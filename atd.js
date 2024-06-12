/*
require 'axios' package to execute this command.

note:
using frequently may causing tiktok temporary ban your ip.
*/

module.exports = [{
    name: "tk-d",
    type: "messageCreate",
    code: `$onlyIf[$message[0]!=;$reply Usage: \`tk-d <url>\`]
$onlyIf[$checkContains[$message[0];vt.tiktok.com;vm.tiktok.com;www.tiktok.com;tiktok.com]!=false;$reply Invalid link.]
$onlyIf[$advancedTextSplit[$message[0];https://;1]!=;$reply Invalid link.]
$let[mid;$sendMessage[$channelID;$reply Getting Player info.;true]]
$if[$checkContains[$message[0];vt.tiktok.com;vm.tiktok.com]==false;
$let[realurl;$message[0]]
;
$let[statusw;$httpRequest[$message[0];GET;fetchurl]]
$onlyIf[$get[statusw]==200;$reply ($get[statusw]) Can't process this. $stop]
$let[fetchurl;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[fetchurl];"seo.abtest":{"canonical":";1;";0];\\u002F;/];\\\\;]]]
$let[realurl;$replaceText[$get[fetchurl];/@/video/;/@$advancedTextSplit[$env[fetchurl];"uniqueId":";1;";0]/video/]]
]
$if[$checkContains[$message;--wm];$let[typecontent;"downloadAddr":"];$let[typecontent;"playAddr":"]]
$let[cookie;$djsEval[
const axios = require('axios');
const url = 'https://www.tiktok.com';
const headers = {
    'User-Agent': "undici",
    'Referer': 'https://www.tiktok.com/'
};

axios.get(url, { headers: headers })
    .then(response => {
        const setCookieHeader = response.headers\\['set-cookie'\\];
        const setCookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
        return setCookieString;
}).catch(error => {
    ctx.channel.send("Error: " + error);
    return null;
});
]
]
$onlyIf[$get[cookie]!=;$reply Failed retrieve cookies. $stop]
$!editMessage[$channelID;$get[mid];Getting Video info.]
$httpAddHeader[user-agent;undici]
$httpAddHeader[referer;https://www.tiktok.com/]
$httpAddHeader[cookie;$get[cookie]]
$!editMessage[$channelID;$get[mid];Downloading.]
$let[statusk;$httpRequest[$get[realurl];GET;test]]
$onlyIf[$get[statusk]==200;$editMessage[$channelID;$get[mid];($get[statusk]) Can't process this.] $stop]
$let[hls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];$get[typecontent];1;";0];\\u002F;/];\\\\;]]]
$onlyIf[$get[hls]!=;$editMessage[$channelID;$get[mid];(204) Video private / not available.] $stop]
$let[mhls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];"music":;1;"playUrl":";1;";0];\\u002F;/];\\\\;]]]
$let[videoid;$advancedTextSplit[$env[test];"webapp.video-detail":{"itemInfo":{"itemStruct":{"id":";1;";0]]
$let[videoarst;$advancedTextSplit[$env[test];"uniqueId":";1;";0]]
$let[videocdn;$advancedTextSplit[$env[test];$get[typecontent];1;video\\\\u002Ftos\\\\u002F;1;\\\\;0]]
$!djsEval[
function extractValidCookiePairs(cookieString) {
    const segments = cookieString.split(';');
    const keyValuePairs = segments.filter(segment => {
        const trimmedSegment = segment.trim();
        return trimmedSegment.includes('=') && !/path=|domain=|samesite=|secure|httponly|expires=/i.test(trimmedSegment);
    });
    return keyValuePairs.join('; ');
}

function extractTTChainToken(cookieString) {
    const match = cookieString.match(/tt_chain_token=\\[^;\\]+/);
    return match ? match\\[0\\] : '';
}

const axios = require('axios');
const fs = require('fs');
const url = ctx.getKeyword("hls");
const cookie = extractValidCookiePairs(ctx.getKeyword("cookie"));
const headers = {
    'User-Agent': "undici",
    'Referer': 'https://www.tiktok.com/',
    'Cookie': extractTTChainToken(cookie)
};

ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
message.edit('Uploading.');
});
axios.get(url, { headers: headers, responseType: 'stream' }).then(response => {
    const writer = fs.createWriteStream('temp_video.mp4');
    
    response.data.pipe(writer);
    
    writer.on('finish', () => {
        const stats = fs.statSync('temp_video.mp4');
        const fileSizeInBytes = stats.size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024); // Convert to MB
        
        if (fileSizeInMegabytes > 10) {
            ctx.channel.send("The file size exceeds the limit of 10MB. It cannot be uploaded.");
            return;
        }
        const attachment = fs.readFileSync('temp_video.mp4');
        ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
        message.edit({
            files: \\[{
                attachment: attachment,
                name: 'videott-' + ctx.getKeyword("videoid") + '.mp4'
            }\\]
    }).then(backup => {
	   const attachmentSizeInBytes = backup.attachments.first().size;
       const attachmentSizeInMB = attachmentSizeInBytes / (1024 * 1024); // Convert to MB
	   backup.edit('\\\`\\\`\\\`xml\\\\nSize	 : ' + attachmentSizeInMB.toFixed(2) + ' MB\\\\nVideoID  : ' + ctx.getKeyword("videoid") + '\\\\nUploader : ' + ctx.getKeyword("videoarst") + '\\\\nCDN	  : ' + ctx.getKeyword("videocdn") + '\\\\nCookie   : ' + extractTTChainToken(cookie) + '\\\\n\\\`\\\`\\\`\\\\n\\[Video\\](' + ctx.getKeyword("hls") + ') | \\[Audio\\](' + ctx.getKeyword("mhls") + ')');
	});
});
        fs.unlinkSync('temp_video.mp4');
    });
}).catch(error => {
    ctx.channel.send("Error: " + error);
    return;
});
]`
}]
