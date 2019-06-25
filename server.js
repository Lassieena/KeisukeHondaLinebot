'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 8000;
const configs = require('./configs');

const config = {
  channelSecret: configs.lineapi.channelSecret,
  channelAccessToken: configs.lineapi.channelAccessToken
};
const app = express();
const client = new line.Client(config);

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);


  Promise
    .all(req.body.events.map(handleMessageEvent))
    .then((result) => res.json(result));
});


function handleMessageEvent(event) {

  if (event.message.type !== 'message' && event.message.type !== 'text') {
    return Promise.resolve(null)
  }
  let msg = {
    type: event.message.type,
    text: event.message.text
  }


  const eventMessageText = event.message.text.toLowerCase();
  if (eventMessageText === "じゃんけん") {
    console.log("成功")
    msg = {
      "type": "text",
      "text": "じゃんけんポン！",
      "quickReply": {
        "items": [{
            "type": "action",
            "action": {
              "type": "message",
              "label": "パー",
              "text": "パー"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "グー",
              "text": "グー"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "チョキ",
              "text": "チョキ"
            }
          }
        ]
      }
    }
  } else if (eventMessageText === "グー" || eventMessageText === "パー" || eventMessageText == "チョキ") {
    let hands = ['グー', 'パー', 'チョキ'];
    let num = Math.floor(Math.random() * hands.length);
    let hand = hands[num];
    let win;
    switch (hand) {
      case 'グー':
        win = 'パー';
        break;
      case 'パー':
        win = 'チョキ';
        break;
      case 'チョキ':
        win = 'グー';
        break;
    }
    const loses = ['俺の勝ち！\n負けは次につながるチャンスです！\nネバーギブアップ！\nほな、 いただきます！', '俺の勝ち！\nたかがじゃんけん、 そう思ってないですか？\nそれやったら明日も、 俺が勝ちますよ。\nほな、 いただきます！', '俺の勝ち！\nなんで負けたか、 明日まで考えといてください。\nそしたら何かが見えてくるはずです。\nほな、 いただきます！'];
    let lose = loses[Math.floor(Math.random() * loses.length)];
    let text;
    if (eventMessageText === win) {
      text = `${hand}！\nやるやん。\n明日は俺にリベンジさせて。\nでは、どうぞ。`
    } else if (eventMessageText === hand) {
      text = `${hand}!\nあいこだけど` + lose
    } else {
      text = `${hand}！\n` + lose
    }
    msg = {
      "type": "text",
      "text": text
    }
  } else {
    msg = {
      "type": "text",
      "text": "俺の勝ち"
    }
  }
  return client.replyMessage(event.replyToken, msg);
}


// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app: app.listen(PORT);
console.log(`Server running at ${PORT}`);