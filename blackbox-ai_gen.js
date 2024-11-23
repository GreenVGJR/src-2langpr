module.exports = {
name: "img-gen",
type: "messageCreate",
code: `$reply[$channelID;$messageID]
$nomention
$onlyIf[$message[0]!=;Usage: \`img-gen <prompt> --type=(number)\`\n\`\`\`--type=(number)\n\n1 : BlackBox.AI\n2 : GPT-4o\n3 : Gemini-Pro\n4 : Claude-Sonnet-3.5\`\`\`]
$onlyIf[$checkContains[$message[1];--type=]!=true;Parameter \`prompt\` should be at first position.]
$onlyIf[$hasPerms[$guildID;$clientID;AttachFiles]!=false;Missing Permission, **Attach Files** - Bot]

$let[content;$advancedTextSplit[$message;--type=;0]]
$let[c1;$advancedTextSplit[$message;--type=;1; ;0]]

$let[model;blackboxai]
$if[$charCount[$get[c1]]==1;
$if[$get[c1]==2;$let[model;gpt-4o];
$if[$get[c1]==3;$let[model;gemini-pro];
$if[$get[c1]==4;$let[model;claude-sonnet-3.5]]]]]
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
  "userSelectedModel": "$get[model]"
}
]
$let[mid;$sendMessage[$channelID;Generating.;true]]
$try[
$httpAddHeader[user-agent;Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_8_4; en-US) AppleWebKit/537.7 (KHTML, like Gecko) Chrome/52.0.3525.375 Safari/603]
$httpSetBody[$get[listbody]]
$let[http;$httpRequest[https://www.blackbox.ai/api/chat;POST;res]]
$onlyIf[$get[http]==200;$!editMessage[$channelID;$get[mid];$nomention ($get[http]) Can't continue the process.]]
$!editMessage[$channelID;$get[mid];$nomention Uploading.]
$!editMessage[$channelID;$get[mid];$nomention $attachment[https://storage.googleapis.com/$advancedTextSplit[$env[res];https://storage.googleapis.com/;1;);0];image.png]
Prompt: ||$get[content]||
Model: $get[model]]
;
$!editMessage[$channelID;$get[mid];Something just happened.]
]
`
}
