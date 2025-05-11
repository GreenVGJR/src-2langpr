module.exports = [{
   name: "b-chat",
   type: "messageCreate",
   code: `$reply $nomention
   $onlyIf[$message[0]!=;
   $addField[Usage;\`b-chat (options?) <prompt>\`;false]
   $addField[Options;$codeBlock[--think    :: Think before responding\n--web      :: Search the web\n--deep     :: *For complex tasks\n--memory   :: **Memorize your chat];false]
   $addField[_ _;-# *Rate limits may apply.\n-# **Experimental.;false]
   $addField[Example;$codeBlock[<prefix>b-chat hello\n<prefix>b-chat --web,--think,--memory find me a cheap headset];false]
   $color[a09fff]]
   $let[use_parameter;$checkContains[$message[0];--imagine;--think;--web;--deep;--memory]]
   $let[except_image_parameter;$checkContains[$message[0];--think;--web;--deep]]
   $if[$get[use_parameter]==true;
   $onlyIf[$message[1]!=;Missing \`prompt\`.]
   ]
   
   $let[user-agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36]

   $let[chat_image;$checkContains[$message[0];--imagine]]
   $let[chat_think;$checkContains[$message[0];--think]]
   $let[chat_web;$checkContains[$message[0];--web]]
   $let[chat_deep;$checkContains[$message[0];--deep]]
   $let[chat_memory;$checkContains[$message[0];--memory]]

   $c[-- Override configure --]
   $if[$checkCondition[true-true==$get[except_image_parameter]-$get[chat_image]];
   $let[chat_think;false]
   $let[chat_web;false]
   $let[chat_deep;false]
   ]

   $let[user_message;$jsonLoad[escapechar;$if[$get[use_parameter];$messageSlice[1];$message]]$jsonStringify[escapechar]]

   $let[bodydata;{
   "messages": \\[
      {
         "id": null,
         "content": $get[user_message],
         "role": "user"
      }
   \\],
   "agentMode": {},
   "id": null,
   "previewToken": null,
   "userId": null,
   "codeModelMode": true,
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
   "isMemoryEnabled": false,
   "mobileClient": false,
   "userSelectedModel": null,
   "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
   "imageGenerationMode": $get[chat_image],
   "webSearchModePrompt": $get[chat_web],
   "deepSearchMode": $get[chat_deep],
   "domains": null,
   "vscodeClient": false,
   "codeInterpreterMode": false,
   "customProfile": "",
   "session": {
      "user": {
         "name": "",
         "email": "",
         "image": "",
         "id": ""
      },
      "expires": ""
   },
   "isPremium": false,
   "subscriptionCache": null,
   "beastMode": false,
   "reasoningMode": $get[chat_think]
   }
   ]

   $async[
   $try[
   $let[tempcookies;$!httpRequest[https://www.blackbox.ai/;HEAD;nonecookie]$httpGetHeader[Set-Cookie]]
   $onlyIf[$get[tempcookies]!=;$!editMessage[$channelID;$get[idmessage];$nomention Something just happened.\nError: Failed to authorize.]]

   $httpSetBody[$get[bodydata]]
   $httpAddHeader[Cookie;$get[tempcookies]]
   $httpAddHeader[Origin;https://www.blackbox.ai]
   $httpAddHeader[Referer;https://www.blackbox.ai]
   $httpAddHeader[User-Agent;$get[user-agent]]
   $httpSetContentType[Text]
   $let[requesting;$httpRequest[https://www.blackbox.ai/api/chat;POST;response_chat]]
   $onlyIf[$get[requesting]==200;$!editMessage[$channelID;$get[idmessage];$nomention Something just happened.\nStatus Code: $get[requesting]]]

   $let[check_quick;$advancedTextSplit[$env[response_chat];\\$~~~\\$;1]]
   $let[check_think;$advancedTextSplit[$env[response_chat];<think>;1;</think>;0]]
   $let[finalresult;$if[$charCount[$get[check_think]]!=0;$advancedTextSplit[$env[response_chat];</think>;1];$if[$charCount[$get[check_quick]]!=0;$advancedTextSplit[$env[response_chat];\\$~~~\\$;2];$env[response_chat]]]]
   $onlyIf[$charCount[$get[finalresult]]!=0;$!editMessage[$channelID;$get[idmessage];$nomention Seems like the response return nothing.]]
   $!editMessage[$channelID;$get[idmessage];
   $nomention
   $if[$get[chat_memory]==true;
   $addActionRow
   $arrayLoad[savechat;]
   $arrayPushJSON[savechat;{
      "client": \\[{
         "author": "$authorID",
         "channel": "$channelID",
         "message": "$messageID",
         "unique": $jsonLoad[escapecookie;$get[tempcookies]]$jsonStringify[escapecookie]
      }\\]
   }]
   $arrayPushJSON[savechat;{
      "chat": \\[{
         "id": null,
         "content": $get[user_message],
         "createdAt": "$parseDate[$getTimestamp;ISO]",
         "role": "user"
      },
      {
         "id": null,
         "content": $jsonLoad[escapechars;$env[response_chat]]$jsonStringify[escapechars],
         "createdAt": "$parseDate[$getTimestamp;ISO]",
         "role": "assistant"
      }\\]
   }]
   $attachment[$env[savechat];conversation-$getTimestamp.json;true]
   $addButton[contcov_$authorID;Continue;Primary;💭]
   $addButton[endcov_$authorID;End;Danger;🗑️]
   ]
   $if[$charCount[$get[check_think]]!=0;$attachment[$get[check_think];think-$getTimestamp.txt;true]]
   $if[$charCount[$get[check_quick]]!=0;$attachment[$if[$isJSON[$get[check_quick]];$jsonLoad[json_quick;$get[check_quick]]$env[json_quick];$get[check_quick]];web_search-$getTimestamp.json;true]]
   $if[$charCount[$get[finalresult]]>=4000;$attachment[$get[finalresult];response-$getTimestamp.txt;true];
   $author[Response | Done in $httpPingms]
   $description[$get[finalresult]]
   $footer[$username[$authorID];$userAvatar[$authorID;256]]
   $color[#$randomBytes[3]]
   $timestamp
   ]
   ]
   ;
   $!editMessage[$channelID;$get[idmessage];$nomention Something just happened.\nStatus Code: (ERROR)\nPlease check the console log for the error details.]
   $log[$env[harderror]];harderror]
   ]
   
   $let[idmessage;$sendMessage[$channelID;-# Generating... $if[$checkContains[true;$get[chat_think];$get[chat_deep]];This may take a while.;$if[true-true==$get[except_image_parameter]-$get[chat_image];Option but 'imagine' will be ignore.]];true]]
   `
},
{
   type: "interactionCreate",
   code: `$onlyIf[$checkContains[$customID;continuecovmodal;endcov;contcov];]
   $onlyIf[$customID!=continuecovmodal;

   $let[use_parameter;$checkContains[$sliceText[$input[usercontinuecov];0;1];--imagine;--think;--web;--deep]]
   $let[except_image_parameter;$checkContains[$sliceText[$input[usercontinuecov];0;1];--think;--web;--deep]]
   $if[$get[use_parameter]==true;
   $onlyIf[$sliceText[$input[usercontinuecov];1]!=;$ephemeral $defer $interactionReply[Missing \`prompt\`.]]
   ]

   $!deferUpdate
   $let[cachelink;$messageAttachment[$channelID;$messageID;0]]
   $let[status;$httpRequest[$get[cachelink];GET;cacheconversation]]
   $onlyIf[$get[status]==200;Something just happened.\nStatus Code: $get[status]]
   $interactionUpdate[-# Extracting data...]
   $jsonLoad[jsoncachecov;$env[cacheconversation]]
   $let[cookies;$env[jsoncachecov;0;client;0;unique]]
   $let[decodecookies;$decodeURIComponent[$get[cookies]]]
   
   $let[user-agent;Mozilla/5.0 (Windows NT 10.0\\; Win64\\; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36]

   $let[chat_image;$checkContains[$sliceText[$input[usercontinuecov];0;1];--imagine]]
   $let[chat_think;$checkContains[$sliceText[$input[usercontinuecov];0;1];--think]]
   $let[chat_web;$checkContains[$sliceText[$input[usercontinuecov];0;1];--web]]
   $let[chat_deep;$checkContains[$sliceText[$input[usercontinuecov];0;1];--deep]]

   $if[$checkCondition[true-true==$get[except_image_parameter]-$get[chat_image]];
   $let[chat_think;false]
   $let[chat_web;false]
   $let[chat_deep;false]
   ]

   $let[user_message;$jsonLoad[escapechar;$if[$get[use_parameter];$sliceText[$input[usercontinuecov];1];$input[usercontinuecov]]]$jsonStringify[escapechar]]
   $let[cachehistory;$env[jsoncachecov;1;chat]]
   $jsonLoad[cachehat;$env[jsoncachecov;1;chat]]
   $arrayLoad[savechat;]
   $!arrayMap[cachehat;testhat;$arrayPushJSON[savechat;$env[testhat]]]
   $arrayPushJSON[savechat;{
         "id": null,
         "content": $get[user_message],
         "createdAt": "$parseDate[$getTimestamp;ISO]",
         "role": "user"
   }]

   $!jsonSet[jsoncachecov;1;chat;$env[savechat]]
   $let[bodydata;{
   "messages": $env[jsoncachecov;1;chat],
   "agentMode": {},
   "id": null,
   "previewToken": null,
   "userId": null,
   "codeModelMode": true,
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
   "isMemoryEnabled": false,
   "mobileClient": false,
   "userSelectedModel": null,
   "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
   "imageGenerationMode": $get[chat_image],
   "webSearchModePrompt": $get[chat_web],
   "deepSearchMode": $get[chat_deep],
   "domains": null,
   "vscodeClient": false,
   "codeInterpreterMode": false,
   "customProfile": "",
   "session": {
      "user": {
         "name": "",
         "email": "",
         "image": "",
         "id": ""
      },
      "expires": ""
   },
   "isPremium": false,
   "subscriptionCache": null,
   "beastMode": false,
   "reasoningMode": $get[chat_think]
   }
   ]

   $interactionUpdate[-# Generating... $if[$checkContains[true;$get[chat_think];$get[chat_deep]];This may take a while.;$if[true-true==$get[except_image_parameter]-$get[chat_image];Option but 'imagine' will be ignore.]]]

   $try[
   $httpSetBody[$get[bodydata]]
   $httpAddHeader[Cookie;$get[decodecookies]]
   $httpAddHeader[Origin;https://www.blackbox.ai]
   $httpAddHeader[Referer;https://www.blackbox.ai]
   $httpAddHeader[User-Agent;$get[user-agent]]
   $httpSetContentType[Text]
   $let[requesting;$httpRequest[https://www.blackbox.ai/api/chat;POST;response_chat]]
   $onlyIf[$get[requesting]==200;Something just happened.\nStatus Code: $get[requesting]]

   $let[check_quick;$advancedTextSplit[$env[response_chat];\\$~~~\\$;1]]
   $let[check_think;$advancedTextSplit[$env[response_chat];<think>;1;</think>;0]]
   $let[finalresult;$if[$charCount[$get[check_think]]!=0;$advancedTextSplit[$env[response_chat];</think>;1];$if[$charCount[$get[check_quick]]!=0;$advancedTextSplit[$env[response_chat];\\$~~~\\$;2];$env[response_chat]]]]
   $onlyIf[$charCount[$get[finalresult]]!=0;Seems like the response return nothing.]
   
   $arrayPushJSON[savechat;
      {
         "id": null,
         "content": $jsonLoad[escapechars;$env[response_chat]]$jsonStringify[escapechars],
         "createdAt": "$parseDate[$getTimestamp;ISO]",
         "role": "assistant"
   }]

   $!jsonSet[jsoncachecov;1;chat;$env[savechat]]
   $attachment[$env[jsoncachecov];conversation-$getTimestamp.json;true]
   $addActionRow
   $addButton[contcov_$authorID;Continue;Primary;💭]
   $addButton[endcov_$authorID;End;Danger;🗑️]
   $if[$charCount[$get[check_think]]!=0;$attachment[$get[check_think];think-$getTimestamp.txt;true]]
   $if[$charCount[$get[check_quick]]!=0;$attachment[$if[$isJSON[$get[check_quick]];$jsonLoad[json_quick;$get[check_quick]]$env[json_quick];$get[check_quick]];web_search-$getTimestamp.json;true]]
   $if[$charCount[$get[finalresult]]>=4000;$attachment[$get[finalresult];response-$getTimestamp.txt;true];
   $author[Response | Done in $httpPingms]
   $description[$get[finalresult]]
   $footer[$username[$authorID];$userAvatar[$authorID;256]]
   $color[#$randomBytes[3]]
   $timestamp
   ]
   ;
   Something just happened.\nStatus Code: (ERROR)\nPlease check the console log for the error details.
   $log[$env[harderror]];harderror]

   ]
   $onlyIf[$advancedTextSplit[$customID;_;1]==$authorID;Only <@!$advancedTextSplit[$customID;_;1]> can use this. $ephemeral]
   $onlyIf[$advancedTextSplit[$customID;_;0]!=endcov;$deferUpdate $!disableButtonsOf[$channelID;$messageID;0]]
   $onlyIf[$advancedTextSplit[$customID;_;0]!=contcov;
   $modal[continuecovmodal;Continue Chat]
   $addTextInput[usercontinuecov;Prompt (Support Options);Paragraph;true;Type something here...;;1;4000]
   ]
   `
}]
