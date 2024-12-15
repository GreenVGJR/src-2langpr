module.exports = {
name: "img-gen",
type: "messageCreate",
code: `$reply[$channelID;$messageID]
$nomention
$onlyIf[$message[0]!=;Usage: \`img-gen <prompt>\`]
$onlyIf[$hasPerms[$guildID;$clientID;AttachFiles]!=false;Missing Permission, **Attach Files** - Bot]

$let[content;$replaceText[$message;
;]]

$let[mid;$sendMessage[$channelID;Generating.;true]]

$let[listbody;{
  "messages": \\[
    {
      "id": null,
      "content": "$get[content]",
      "role": "user"
    }
  \\],
  "id": null,
  "previewToken": null,
  "userId": null,
  "codeModelMode": true,
  "agentMode": {
    "mode": true,
    "id": "ImageGenerationLV45LJp",
    "name": "Image Generation"
  },
  "trendingAgentMode": {},
  "isMicMode": false,
  "userSystemPrompt": null,
  "maxTokens": 1024,
  "playgroundTopP": null,
  "playgroundTemperature": null,
  "isChromeExt": false,
  "githubToken": "",
  "clickedAnswer2": false,
  "clickedAnswer3": false,
  "clickedForceWebSearch": false,
  "visitFromDelta": false,
  "mobileClient": false,
  "userSelectedModel": null,
  "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
  "imageGenerationMode": false,
  "webSearchModePrompt": false
}
]

$c[-- Generate Image --]
$try[
$httpAddHeader[user-agent;Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_8_4; en-US) AppleWebKit/537.7 (KHTML, like Gecko) Chrome/52.0.3525.375 Safari/603]
$httpAddHeader[origin;https://www.blackbox.ai]
$httpAddHeader[referer;https://www.blackbox.ai/agent/ImageGenerationLV45LJp]
$httpAddHeader[content-type;application/json]
$httpSetBody[$get[listbody]]
$let[http;$httpRequest[https://www.blackbox.ai/api/chat;POST;res]]
$onlyIf[$get[http]==200;$!editMessage[$channelID;$get[mid];$nomention ($get[http]) Can't continue the process.]]
$!editMessage[$channelID;$get[mid];$nomention $attachment[https://storage.googleapis.com/$advancedTextSplit[$env[res];https://storage.googleapis.com/;1;);0];image.jpeg]
]
;
$!editMessage[$channelID;$get[mid];Something just happened.]
]
`
}
