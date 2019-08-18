/**
 * send to Slack
 * @param {object} data  send data
 * @param {object} url   webhook url
 */
function sendToSlack(data, url) {
  var payload = JSON.stringify(data);
  var options = {
    "method" : "POST",
    "contentType" : "application/json",
    "payload" : payload
  };
  UrlFetchApp.fetch(url, options);
}

/**
 * Make send data
 * @param  {string} username : bot name
 * @param  {string} channelName : send slack channe name
 * @param  {string} icon : icon(emoji name)
 * @param  {string} text : text
 * @param  {list} attachments: attachments data
 * @return {object} json data : send data for slack
 */
function makeSendData(username,
                      channelName,
                      icon,
                      text,
                      attachments){
  
  var jsonData = {
    username: username,
    channel: channelName,
    icon_emoji: icon,
    text: text,
    attachments: attachments
  }
  return jsonData;
}

/**
 * Make atttachment
 * @param {string} name : payment username
 * @param {object} data : payment data
 * @param  {string} color : attachmenet color code ex) #aaaaaa
 * @return {object} attachment : attachment data
 */
function makeAttachment(name, data, color) {
  return {
    title: name,
    text: data,
    color: color
  }
}

function getThisMonthSheetName() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var res = year + '/' + ('00' + month).slice(-2);
  return res;
}

function noticeWork() {
  // spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(getThisMonthSheetName());

  if(!sheet) return null;

  var values = sheet.getDataRange().getValues();
  
  var dt = new Date();
  var today = dt.getDate();

  var worktimes = '';  

  for(var i = today; i < (today + 5); i++) {
    if(values.length < i) {
      res += "翌月分の仕事スケジュールが入力されていないようです。\n";
      break;
    } else {
      worktimes += (values[i][0].getMonth() + 1) + "/" + values[i][0].getDate() + " : ";
      worktimes += values[i][1];
      worktimes += "\n";
    }
  }

  var attachments = []
  attachments.push(makeAttachment("5日先までの仕事スケジュールを記載しています", worktimes, "#1e90ff"));
  
  /*** Please rewrite freely according to your taste. ***/
  var jsonData = makeSendData("お仕事時間報告BOT",
               "#your specific channel",
               ":memo:",
               "{UserName}さんのお仕事スケジュールを報告します💁",
               attachments
              )
  var POST_URL = "" // slack webhook URL
  sendToSlack(jsonData, POST_URL);
}
