function putSomeStuffInScriptDB() {
var ob = {type: "TaskAuto",
          group: "DASM",
          email: [ "imelda.tapang@bia.gov",
                  "chaeny.emanavin@bia.gov",
                  "george.morris@bia.gov",
                  "jingru.barr@bia.gov",
                  "brian.hardy@bia.gov",
                  "matthew.coulon@bia.gov",
                  "stanley.smith@bia.gov",
                  "daniel.joplin@bia.gov",
                  "david.roberts@bia.gov",
                  "michael.black@bia.gov",
                  "brian.rice@bia.gov"]
           };
db.save(ob);
var ob3 = {type: "TaskGroup",
           group: "DASM",
           members: [ "imelda.tapang@bia.gov",
                  "chaeny.emanavin@bia.gov",
                  "george.morris@bia.gov",
                  "jingru.barr@bia.gov",
                  "brian.hardy@bia.gov",
                  "matthew.coulon@bia.gov",
                  "stanley.smith@bia.gov",
                  "daniel.joplin@bia.gov" ]
          };
db.save(ob3)
}

function combineGroups() {
  var query = db.query({type: "TaskAuto"});
  var finalEmailArray = [];
  var finalKeywordArray = [];
  while(query.hasNext()) {
    var current = query.next();
    var emails = current.email;
    var keywords = current.keyword;
    for(var a=0; a<emails.length; a++){
      var email = emails[a];
      var emailsString = finalEmailArray.join(',');
      if(finalEmailArray.indexOf(email) == -1) {
        finalEmailArray.push(email);
      }
    }
    if(keywords !== undefined) {
      for(var b=0; b<keywords.length; b++){
        var keyword = keywords[b];
        var keywordsString = finalKeywordArray.join(',');
        if(finalKeywordArray.indexOf(keyword) == -1) {
          finalKeywordArray.push(keyword);
        }
      }
    }
  }
  
  var ob = {type: "Autocomplete",
            email: finalEmailArray,
            keyword: finalKeywordArray
           };
//  db.save(ob);
}

function getGroupAutoComplete(type) {
  //type = "keyword";
  var activeUser = Session.getActiveUser().getEmail();
  var data = db.query({type: "TaskGroup" });
  var finalArray = [];
  var group = '';
  while (data.hasNext()) {
    var current = data.next();
    for(var i = 0; current.members.length > i; i++) {
      if(current.members[i] == activeUser) { 
        group = current.group;
        var autoData = db.query({type: "TaskAuto", group: group}).next();
        if(type === "keyword") { finalArray = autoData.keyword; } 
        else { finalArray = autoData.email; }
       } 
      Utilities.sleep(500);
    }
    
  }
  Logger.log('the array is: ' + finalArray)
  return finalArray;  
}

function showEverythingForOID() {
var data = db.query({ group: "OID", type: "TaskAuto" });
  while (data.hasNext()) {
    var current = data.next();
    Logger.log(current);
  }
  for(var i = 0; current.keyword.length > i; i++) {
    if(current.keyword[i] == null) {
    //Logger.log(
//      var index = current.keyword.indexOf(null);
//        if (index > -1) {
//          current.keyword.splice(index, 1);
//          db.save(current);
//          Logger.log('did');
//        }
    }
  }
}

function writeToScriptDB(value) {
  //value = ['stanley.smith@bia.gov','matthew.coulon@bia.gov'];
  //get their group info
  var activeUser = Session.getActiveUser().getEmail();
  var groupData = db.query({type: "TaskGroup" });
  var group = '';
  while (groupData.hasNext()) {
    var current = groupData.next();
    for(var i = 0; current.members.length > i; i++) {
      if(current.members[i] == activeUser) { 
        group = current.group;
        break;
      }
    }
  }
  var data = db.query({type: "TaskAuto", group: group });
  var current = data.next();
  //loop through array of values
  for(var j = 0; j < value.length; j++) {
    //loop through current keywords in db to see if there's a match
    for(var k = 0; current.email.length > k; k++) {
      var flag = false;
      if(current.email[k] == value[j]) {
        Logger.log(value[j]);
        flag = true;
        break;
      }
    }
    if(!flag) { 
        current.email.push(value[j]);
        Logger.log(value[j]);
        db.save(current); 
        //return value[j] + ' was saved to your list' + yeanay + 'your array: ' + value;
        Logger.log(value[j] + ' is not in there!')
    } else {
        //return value[j] + ' already exists in your list' + yeanay + 'your array: ' + value;
        Logger.log( value[j] + ' is in there!')
    }
  }
  var info = Logger.getLog();
  return value + ' ' + typeof value + ' ' + value[0] + value[1] + value[2] + value[3] + value[4] + ' logs: ' + info;
}

//  //use that group info to get correct autocomplete list
//  var data = db.query({ type: "TaskAuto", group: group });
//  var flag = false;
//  while (data.hasNext()) {
//    var current = data.next();
//    for(var i = 0; current.email.length > i; i++) {
//      if(current.email[i] == value) { flag = true; }
//    }
//    if(!flag) { 
//      current.email.push(value); 
//      db.save(current); 
//      //return value + ' was saved to your list';
//      Logger.log(value + ' is not in there!')
//    } else {
//      //return value + ' already exists in your list';
//      Logger.log( value + ' is in there!')
//    }
//  }
//}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

function getKeywordsForAutoComplete() {
//do all them queries
  var currentUser = Session.getActiveUser().getEmail();
  var groupData = db.query({type: "TaskGroup" });
  var group = '';
  while (groupData.hasNext()) {
    var current = groupData.next();
    for(var i = 0; current.members.length > i; i++) {
      if(current.members[i] == currentUser) { 
        group = current.group;
        break;
      }
    }
  }

  var autoData = db.query({type: "TaskGroup", group: group });
  var keywordArray = [];  
  var times = 0;
  while (autoData.hasNext()) {
    var currentData = autoData.next();
    for(var i=0; i<currentData.members.length; i++) {
      var user = currentData.members[i];
      var creatorData = db.query({ type: "TaskData", Creator: user });
      var ownerData = db.query({ type: "TaskData", Owner: user });
      var assigneeData = db.query({ type: "TaskData", Assignee: user });
      //loop thru queries and push keywords to one array
      while(ownerData.hasNext()) {
        var current = ownerData.next();
        var keywords = current.Tags;
        var tempArray = keywords.split(', ');
        for(var j=0; j<tempArray.length; j++) { 
          keywordArray.push(tempArray[j]); 
        }
        times++;
        Utilities.sleep(500);
      }
      
      while(assigneeData.hasNext()) {
        var current = assigneeData.next();
        var keywords = current.Tags;
        var tempArray = keywords.split(', ');
        for(var j=0; j<tempArray.length; j++) { 
          keywordArray.push(tempArray[j]); 
        }
        times++;
        Utilities.sleep(500);
      }
      
      while(creatorData.hasNext()) {
        var current = creatorData.next();
        var keywords = current.Tags;
        var tempArray = keywords.split(', ');
        for(var j=0; j<tempArray.length; j++) { 
          keywordArray.push(tempArray[j]); 
        }
        times++;
        Utilities.sleep(500);
      }  
    }
  }
  //lowercase everything in array
  var helperArray = [];
  for(var i=0; i<keywordArray.length; i++) {
    helperArray.push(keywordArray[i].toLowerCase());
  }
  keywordArray = helperArray;
  keywordArray = keywordArray.getUnique();
  for(var j=0; j<keywordArray.length; j++) {
    Logger.log(keywordArray[j]);
  }
  return keywordArray;
}

function writeToScriptDBKeyword(value) {
  //value = 'crazy, test 2, test 3, test 4, what is this';
  value = value.toLowerCase().split(', ');
  Logger.log(value);
  var activeUser = Session.getActiveUser().getEmail();
  var groupData = db.query({type: "TaskGroup" });
  var group = '';
  while (groupData.hasNext()) {
    var current = groupData.next();
    for(var i = 0; current.members.length > i; i++) {
      if(current.members[i] == activeUser) { 
        group = current.group;
        break;
      }
    }
  }
  var data = db.query({type: "TaskAuto", group: group });
  var current = data.next();
  if(current.keyword === undefined || current.keyword.length === 0) {
    var keywordArray = getKeywordsForAutoComplete();
    current.keyword = keywordArray;
    db.save(current);
    var yeanay = ' yea';
  } else { yeanay = ' nay'; }
  
  //loop through array of values
  for(var j = 0; j < value.length; j++) {
    //loop through current keywords in db to see if there's a match
    for(var k = 0; current.keyword.length > k; k++) {
      var flag = false;
      if(current.keyword[k] == value[j]) {
        Logger.log(value[j]);
        flag = true;
        break;
      }
    }
    if(!flag) { 
        current.keyword.push(value[j]);
        Logger.log(value[j]);
        db.save(current); 
        //return value[j] + ' was saved to your list' + yeanay + 'your array: ' + value;
        Logger.log(value[j] + ' is not in there!')
    } else {
        //return value[j] + ' already exists in your list' + yeanay + 'your array: ' + value;
        Logger.log( value[j] + ' is in there!')
    }
  }
  var info = Logger.getLog();
  return value + ' ' + typeof value + ' ' + value[0] + value[1] + value[2] + value[3] + value[4] + ' logs: ' + info;
}