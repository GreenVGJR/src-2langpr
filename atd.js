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
$let[mid;$sendMessage[$channelID;$reply Getting Video info.;true]]
$let[ismobileurl;false]
$let[ishdvideo;false]
$let[quality;SD]
$let[cacherealeurl;$message[0]]
$if[$checkContains[$message[0];vt.tiktok.com;vm.tiktok.com]==false;
$let[realurl;$message[0]]
$let[statusz;$httpRequest[$message[0];HEAD;whichcookie]]
$onlyIf[$get[statusz]==200;$!editMessage[$channelID;$get[mid];($get[statusz]) Can't process this.] $stop]
$let[storecookie;$httpGetHeader[Set-Cookie]]
;
$let[statusw;$httpRequest[$message[0];GET;fetchurl]]
$onlyIf[$get[statusw]==200;$!editMessage[$channelID;$get[mid];($get[statusw]) Can't process this.] $stop]
$let[storecookie;$httpGetHeader[Set-Cookie]]
$let[fetchurl;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[fetchurl];"seo.abtest":{"canonical":";1;";0];\\u002F;/];\\\\;]]]
$let[realurl;$replaceText[$get[fetchurl];/@/video/;/@$advancedTextSplit[$env[fetchurl];"uniqueId":";1;";0]/video/]]
$let[ismobileurl;true]
]
$if[$checkContains[$message;--wm];$let[typecontent;"downloadAddr":"];$let[typecontent;"playAddr":"]]
$onlyIf[$checkContains[$message;--wm --lite;--lite --wm]!=true;$!editMessage[$channelID;$get[mid];(404) There's no watermark video for lite version.]]
$onlyIf[$checkContains[$message;--wm --hd;--hd --wm]!=true;$!editMessage[$channelID;$get[mid];(404) There's no watermark video for HD version.]]
$let[cookie;$djsEval[
    const setCookieHeader = ctx.getKeyword("storecookie");
    const setCookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
    setCookieString;
]
]
$onlyIf[$get[cookie]!=;$reply Failed retrieve cookies. $stop]
$httpAddHeader[user-agent;undici]
$httpAddHeader[referer;https://www.tiktok.com/]
$httpAddHeader[cookie;$get[cookie]]
$let[statusk;$httpRequest[$get[realurl];GET;test]]
$onlyIf[$get[statusk]==200;$!editMessage[$channelID;$get[mid];($get[statusk]) Can't process this.] $stop]
$if[$checkContains[$message;--lite];
$let[quality;LQ]
$let[hls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];"GearName":"lowest_;1;"UrlList":\\\[";1;",;0];\\u002F;/];\\\\;]]]
;
$if[$checkContains[$message;--hd];
$let[ishdvideo;true]
$let[quality;HD]
$let[hls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];"GearName":"adapt_lowest;1;"UrlList":\\\[";1;",;0];\\u002F;/];\\\\;]]]
$if[$get[hls]==;$let[hls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];"GearName":"adapt_lower_;1;"UrlList":\\\[";1;",;0];\\u002F;/];\\\\;]]]]
;
$let[hls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];$get[typecontent];1;";0];\\u002F;/];\\\\;]]]
]]
$onlyIf[$get[hls]!=;$!editMessage[$channelID;$get[mid];(204) Video private / not available.] $stop]
$if[$checkContains[$message;--wm];
$onlyIf[$advancedTextSplit[$get[hls];v16-webapp-;1]!=;$!editMessage[$channelID;$get[mid];(403) Tiktok restrict this feature.] $stop]
]
$let[mhls;$decodeURI[$replaceText[$replaceText[$advancedTextSplit[$env[test];"music":;1;"playUrl":";1;";0];\\u002F;/];\\\\;]]]
$let[videoid;$advancedTextSplit[$env[test];"webapp.video-detail":{"itemInfo":{"itemStruct":{"id":";1;";0]]
$let[videoarst;$advancedTextSplit[$env[test];"uniqueId":";1;";0]]
$let[videocdn;$advancedTextSplit[$env[test];$get[typecontent];1;video\\\\u002Ftos\\\\u002F;1;\\\\;0]]
$let[copyrightaudio;$advancedTextSplit[$env[test];"err_sound_copy":";1;";0;.;0].]
$!djsEval[
function extractValidCookiePairs(cookieString) {
    const cookies = cookieString.split(',');
    const validCookies = cookies.map(cookie => {
        const keyValue = cookie.split(';')\\[0\\].trim();
        return keyValue;
    });

    return validCookies.join('; ');
}

function extractTTChainToken(cookieString) {
    // Use a regex to find the tt_chain_token
    const match = cookieString.match(/tt_chain_token=(\\[^;\\]+)/);
    return match ? match\\[1\\] : '';
};

const axios = require('axios');
const fs = require('fs');
const url = ctx.getKeyword("hls");
const cookie = extractValidCookiePairs(ctx.getKeyword("cookie"));
const headers = {
   'User-Agent': "undici",
   'Referer': 'https://www.tiktok.com/',
   'Cookie': cookie,
   'Accept': 'video/mp4'
};

try {
  axios.get(url, { headers: headers, responseType: 'stream' }).then(response => {
    const buffer = \\[\\];
    let totalBytes = 0;
    let downloadedBytes = 0;
    let lastUpdate = 0;

    response.data.on('data', chunk => {
      buffer.push(chunk);
      downloadedBytes += chunk.length;
      totalBytes = response.data.headers\\['content-length'\\];

      const fileSizeInMegabytes = totalBytes / (1024 * 1024); // Convert to MB

      if (fileSizeInMegabytes > 25) {
        ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
          message.edit("The file size exceeds the limit of 25 MB (" + fileSizeInMegabytes.toFixed(2) + " MB). It cannot be uploaded.");
        });
        response.data.destroy(); // Stop the download
        return;
      }

      const now = Date.now() / 1000;
      if (now - lastUpdate >= 2) {
        lastUpdate = now;
        const percentage = Math.round((downloadedBytes / totalBytes) * 100);
        const bytesDownloaded = (downloadedBytes / (1024 * 1024)).toFixed(2) + 'MB';

        ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
          message.edit('Downloading. ' + percentage + '% (' + bytesDownloaded + ')');
        });
      }
    });

    response.data.on('end', () => {
      const videoBuffer = Buffer.concat(buffer);
      const fileSizeInBytes = videoBuffer.byteLength;
      const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024); // Convert to MB


      ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
        message.edit((ctx.getKeyword("ishdvideo") == "true" ? "Video doesn't play normally? Download it first." : '') + '\\\`\\\`\\\`xml\\\\nQuality   : ' + ctx.getKeyword("quality") + '\\\\nSize      : ' + fileSizeInMegabytes.toFixed(2) + ' MB\\\\nVideoID   : ' + ctx.getKeyword("videoid") + '\\\\nUploader  : ' + ctx.getKeyword("videoarst") + '\\\\nCDN	   : ' + ctx.getKeyword("videocdn") + '\\\\nCookie    : ' + extractTTChainToken(cookie) + '\\\\nCopyright : ' + ctx.getKeyword("copyrightaudio") + (ctx.getKeyword("ismobileurl") == "true" ? '\\\\n\\\\nInput URL : ' + ctx.getKeyword("cacherealeurl") + '\\\\nVideo URL : ' + ctx.getKeyword("realurl") + '\\\\n\\\`\\\`\\\`' : '\\\\n\\\`\\\`\\\`') + '\\\\n\\[Video\\](' + ctx.getKeyword("hls") + ') | \\[Audio\\](' + ctx.getKeyword("mhls") + ')');
      });

      ctx.channel.messages.fetch(ctx.getKeyword("mid")).then(message => {
        message.edit({
          files: \\[{
            attachment: videoBuffer,
            name: 'videott-' + ctx.getKeyword("videoid") + '.mp4'
          }\\]
        });
      });
    });
  })
  .catch(error => {
    throw error;
  });
} catch (error) {
  ctx.channel.send('Error: ' + error.message);
  console.error(error);
}]`
}]
