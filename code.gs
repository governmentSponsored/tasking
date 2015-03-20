var currentUserEmail = Session.getActiveUser().getEmail(),
	appLink = "https://script.google.com/a/macros/bia.gov/s/AKfycbwcvcmIJp1j66whrQUr1raD8_7J67_aCyAQMogk8BOXGH1taZ4/exec";

function doGet() {
  var htmlPage = HtmlService.createTemplateFromFile('parse_dashboard.html')
  .evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setTitle('Tasking');
  
  return htmlPage;
}

function getContent(filename) {
	var html = HtmlService.createTemplateFromFile(filename).getRawContent();
	return html;
}

function getKeys() {
	  var properties = PropertiesService.getScriptProperties().getProperties();
	  var appId = properties.appId;
	  var restApi = properties.restApi;
	  var class = properties.class;
	  var obj = { appId: appId, restApi: restApi, class: class };
	  	  
	  return obj;
}

function postTask(taskName, requestingOffice, dueDate, taskOwner, assignTaskTo, priority, category, lastAction, lastActionDate, stakeholders, tags, description, files) {
	var properties = getKeys();
	var appId = properties.appId;
	var restApi = properties.restApi;
	var class = properties.class;
	var url = 'https://api.parse.com/1/classes/' + class;	  
    var options = {
	    "method" : "post",
	    "headers" : {
	      "X-Parse-Application-Id": appId,
	      "X-Parse-REST-API-Key": restApi,
	      "Content-Type": "application/json"
	    },
	    "contentType" : "application/json",
	    "muteHttpExceptions" : true,
	    "payload" : '{ "Type": "TaskData", "Name": "' + taskName + '", "ReqOffice": "' + requestingOffice + '"}'
	  }
	  
	  var data = UrlFetchApp.fetch(url, options);
      var json = data.getContentText();
	  var cleanData = JSON.parse(json);
	  
	  return [cleanData];
}

function getAllTasks() {
	  var properties = getKeys();
	  var appId = properties.appId;
	  var restApi = properties.restApi;
	  var class = properties.class;
	  var url = 'https://api.parse.com/1/classes/' + class;
	  
	  //options that are passed into the header along with the method
	  var options = {
	    "method" : "get",
	    "headers" : {
	      "X-Parse-Application-Id": appId,
	      "X-Parse-REST-API-Key": restApi,
	    }
	  }
	  
	  var data = UrlFetchApp.fetch(url, options);
	  var cleanData = JSON.parse(data).results;
	  
	  return cleanData;
}

function getSpecificTasks(query) {
	var allTasks = getAllTasks(),
	length = allTasks.length,
	i = 0,
	currentTask,
	currentTaskString,
	reqOffice,
	resultArray = [];
	
	for(i; i<length; i++) {
		currentTask = allTasks[i];
		currentTaskString = currentTask.Name + currentTask.ReqOffice;
		if(currentTaskString.toLowerCase()
							.indexOf(query.toLowerCase()) > -1) {
			resultArray.push(currentTask);
		}
	}
	
	if(resultArray.length === 0) {
		resultArray.push('No Results!')
	}
	
	return resultArray;
}

function updateATask(objectId,changeObj) {
	var properties = getKeys();
	var appId = properties.appId;
	var restApi = properties.restApi;
	var class = properties.class;
	// changeObj = {Name: 'another new name', ReqOffice: "another new office"};
	
	var url = 'https://api.parse.com/1/classes/' + class + '/' + objectId;
	  
	  //options that are passed into the header along with the method
	 var options = {
	    "method" : "put",
	    "headers" : {
	      "X-Parse-Application-Id": appId,
	      "X-Parse-REST-API-Key": restApi,
	      "Content-Type": "application/json"
	    },
	    "contentType" : "application/json",
	    "muteHttpExceptions" : true,
	    "payload" : '{ "Name": "' + changeObj.Name + '", "ReqOffice": "' + changeObj.ReqOffice + '"}'
	  }
	  
	  var data = UrlFetchApp.fetch(url, options);
	  var cleanData = JSON.parse(data).results;
	  
	  return cleanData;
}

function deleteATask(objectId) {
	var properties = getKeys();
	var appId = properties.appId;
	var restApi = properties.restApi;
	var class = properties.class;
	
	var url = 'https://api.parse.com/1/classes/' + class + '/' + objectId;
	  
	//options that are passed into the header along with the method
	  var options = {
	    "method" : "delete",
	    "headers" : {
	      "X-Parse-Application-Id": appId,
	      "X-Parse-REST-API-Key": restApi,
	    }
	  }
	  
	  var data = UrlFetchApp.fetch(url, options);
	  var cleanData = JSON.parse(data).results;
	  Logger.log(cleanData);
	  
	  return cleanData;
}
/*
function submitComment(taskName, dueDate, requestingOffice, taskOwner, assignTaskTo, priority, category, lastAction, lastActionDate, stakeholders, tags, description, files) {
  var taskCreationTime = new Date();
  var taskCreationTimeForId = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMddHHmmss");
  var emailForId = currentUserEmail.split('.')[1].split('@')[0].substring(0,4).toUpperCase();  
  var taskId = emailForId + taskCreationTimeForId;
  var taskDueDate = new Date(dueDate);
  var allUsers = taskOwner.concat(assignTaskTo);
  //the object to be passed to ScriptDb on Submit
  var ob = {type: "TaskData", 
            ID: taskId, 
            Name: taskName, 
            ReqOffice: requestingOffice, 
            Owner: taskOwner,
            Assignee: assignTaskTo,
            Creator: currentUserEmail,
            Priority: priority,
            CreationDate: {
              timestamp: taskCreationTime.getTime(), month: taskCreationTime.getMonth(), day: taskCreationTime.getDay(), date: taskCreationTime.getDate(), year: taskCreationTime.getFullYear()
            },
            DueDate: {
              timestamp: taskDueDate.getTime(), month: taskDueDate.getMonth(), day: taskDueDate.getDay(), date: taskDueDate.getDate(), year: taskDueDate.getFullYear()
            },
            Files: files,
            Comment: [{
              activity: lastAction, date: lastActionDate, user: email, type: 'Create'
            }], 
            Status: "ns",
            CompletionDate: "",
            Stakeholder: stakeholders,
            Category: category,
            Tags: tags,
            ParentID: null,
            TotalHours: 0,
            Description: description
            };
  //save that object to the db
  
  
  //return id
  return taskId;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function sendEmailNotification(taskOwnerArray, assigneeArray, taskName, dueDate, priority, emailSubject, isAssignee) {
  var creatorEmail = Session.getActiveUser().getEmail();
    if(priority == 3) {priority = 'High'; } else if(priority == 2) {priority = 'Medium'; } else if(priority == 1) { priority = 'Low'; }
    if(isAssignee) {
      var loopArray = assigneeArray;
      var firstLine = "<p>This message was sent to let you know that <b>" + minnow.normalizeDOIUsernames(creatorEmail) + '</b> has assigned the task <b>"' + taskName + '"</b> to you. ' + minnow.normalizeDOIUsernames(assigneeArray[0]) + ' was designated as the lead assignee for this task.';
    } else {
      loopArray = taskOwnerArray.split(', ');
      firstLine = "<p>This message was sent to let you know that <b>" + minnow.normalizeDOIUsernames(creatorEmail) + '</b> has assigned you to be an owner of the task <b>"' + taskName + '"</b>. ' + minnow.normalizeDOIUsernames(loopArray[0]) + ' was designated as the main owner for this task.';
    }
    for(var i = 0; i<loopArray.length; i++) {
    var reqHtmlBody = "<p>Hello " + minnow.normalizeDOIUsernames(loopArray[i]) + ",</p>"+
      firstLine +
      " <br /> "+
        "<fieldset style='width:700px;'>"+
        "                 <legend><span style='color:#888;'>Task Summary</span></legend>"+
        "                 <table cellpadding='2' cellspacing='3'>"+
        "                   <tr>"+
        "                     <td width='25%' align='right' valign='top'><span style='font-weight:bold;color:#333;'>Task Name: </span></td>"+
        "                     <td>" + taskName + "</td>"+
        "                   </tr>"+
        "                   <tr>"+
        "                     <td align='right' valign='top'><span style='font-weight:bold;color:#333;'>Due Date: </span></td>"+
        "                     <td>" + dueDate + "</td>"+
        "                   </tr>"+
        "                   <tr>"+
        "                     <td align='right' valign='top'><span style='font-weight:bold;color:#333;'>Priority: </span></td>"+
        "                     <td>" + priority + "</td>"+
        "                   </tr>"+
        "                   <tr>"+
        "                     <td align='right' valign='top'><span style='font-weight:bold;color:#333;'>Task Creator: </span></td>"+
        "                     <td>" + creatorEmail + "</td>"+
        "                   </tr>"+
        "                   <tr>"+
        "                     <td align='right' valign='top'><span style='font-weight:bold;color:#333;'>Task Owner(s): </span></td>"+
        "                     <td>" + taskOwnerArray + "</td>"+
        "                   </tr>"+
        "                   <tr>"+
        "                     <td colspan='2' align='right' valign='top'><span style='font-weight:bold;color:#333;'><hr /></span></td>"+
        "                   </tr>"+      
        "                   <tr>"+
        "                     <td align='right' valign='top'><span style='font-weight:bold;color:#333;'>Link to Tasking Application: </span></td>"+
        "                     <td><a href='" + appLink + "' style='display:inline;'>View Your Tasking Dashboard</a></td>"+      
  //      "                     <td><form action='https://script.google.com/a/macros/bia.gov/s/AKfycbwcvcmIJp1j66whrQUr1raD8_7J67_aCyAQMogk8BOXGH1taZ4/exec' style='display: inline-block; padding: 2px 8px; background: ButtonFace; color: ButtonText; border-style: solid; border-width: 2px; border-color: ButtonHighlight ButtonShadow ButtonShadow ButtonHighlight;'><input type='submit' value='View Your Tasking Dashboard' /></form></td>"+
        "                   </tr>"+      
        "                 </table>"+   
        "               </fieldset>";
    MailApp.sendEmail(loopArray[i], emailSubject + taskName, "", {htmlBody: reqHtmlBody, noReply: true});
    }
}

function sendCompletedTaskEmailNotification(taskOwnerArray, taskName, completionDetails, completionDate){
    var loopArray = taskOwnerArray;
    for(var i = 0; i<loopArray.length; i++) {
    var reqHtmlBody = "<p>Hello " + minnow.normalizeDOIUsernames(loopArray[i]) + ",</p>"+
      '<p>This message was sent to let you know that <b>' + minnow.normalizeDOIUsernames(currentUserEmail) + '</b> has marked the task named <b>"' + taskName + '"</b> as COMPLETE.'+
      ' <br /> '+
      ' <br /> '+
      minnow.normalizeDOIUsernames(currentUserEmail) + ' said: ' +
      '<p>"' + completionDetails + '"</p>';
    MailApp.sendEmail(loopArray[i], "Completed Task - " + taskName, "", {htmlBody: reqHtmlBody, noReply: true});
    }
}

function formatDatePickerDate(dateIn){
var year = dateIn.substring(0,4);
var month = dateIn.substring(5,7);
var day = dateIn.substring(8,dateIn.length);

var formattedDate = month + "/" + day + "/" + year;

return formattedDate;
}

function testEmail() {
  sendEmailNotification("stanley.smith@bia.gov", ['matthew.coulon@bia.gov'], 'test email notification again', '09/26/13', 2, 'New Task Created - ', false);
}

function callEverything() {
  var data = db.query({type: "TaskData"});
  while (data.hasNext()) {
    var current = data.next();
    Logger.log(current);
  }
}

function queryOne(){
  /*var result = db.query({type: "TemplateData"});
  while(result.hasNext()){
    Logger.log(result.next());
  }
  
}

function deleteTask(){
  //deleteSelectively("TaskAuto", "OID");
  var taskArray = ['MORR20130821090314', 'JOPL20140123151456', 'JOPL20140123160115']
  for(var i=0; i<taskArray.length; i++) {
    /*var current = db.query({type: "TaskData", ID: taskArray[i]}).next();
    db.remove(current);
  }
  
}

function deleteSelectively(theType, id) {
	/* var data = db.query({type: theType, group: id}).next();
  //db.remove(data);
  data.keyword = [];
  db.save(data);
  Logger.log(data);
}

function updateSelectively(){
	/*var data = db.query({type: "TaskData", ID:"TAPA20130812103408"}).next();
  data.Owner = "imelda.tapang@bia.gov";
  db.save(data);
}

function getDBSize() {
	/*var dbSize = minnow.getDBSize(db.query({}));
  Logger.log(dbSize);
}

function createUserPreferenceObject() {
  var currentUser = Session.getActiveUser().getEmail();
  /*var data = db.query({type: "TaskUser", user: currentUser});
  var current = data.next();
  if(data.getSize() === 0) {
    var ob = {type: "TaskUser", 
            user: currentUser,
            Preferences: {
              onCreate: true, 
              weekly: true, 
              onClose: true, 
              dueDateChange: true,
              statusChange: true,
              assigneeChange: true
              },
            taskFolder: ''
            };
    //save that object to the db
    db.save(ob);
    Logger.log("save new object: " + ob);
  
/*var autoComplete = db.query({type: "TaskGroup"});
  while(autoComplete.hasNext()) {
    var current = autoComplete.next();
    var joined = current.members.join(',');
    if(joined.indexOf(currentUser) > -1) {
      Logger.log(currentUser + ' is in here');
    } else {
      current.members.push(currentUser);
      db.save(current);
      Logger.log('not here');
    }
  }
}

function getUserObjects(){
  var data_array = new Array();
  /*var data = db.query({type: "TaskUser"});
  while (data.hasNext()) {
    var current = data.next();
    data_array.push(current.user);
  }
  Logger.log(data_array);
  return data_array;
}

function getUserEmailAddress() {
  var userEmail = Session.getActiveUser().getEmail();
  //Logger.log(typeof userEmail);
  return userEmail;
}

function convertOwnerStringToArray() {
	/*var data = db.query({type: "TaskData"});
  var data_array = new Array();
  while (data.hasNext()) {
    var current = data.next();
    var assigneeArray = [];
    if(typeof current.Owner != 'object') {
      assigneeArray.push(current.Owner);
      current.Owner = assigneeArray;
      db.save(current);
    } 
    Logger.log(current.Owner);
    Utilities.sleep(1000);
  }
}

function convertActivityLogStringToArrayOfObjects() {
	/*var query = db.query({type: "TaskData"});
  while(query.hasNext()) {
    var current = query.next();
    var comment = current.Comment;
    var creator = current.Creator;
    current.Comment = [{
                activity: comment, date: "No Date", user: creator, type: 'Create'
              }];
//    Logger.log(current.Comment)
    db.save(current);
    Utilities.sleep(1000);
  }
}

function updateActivityLog(taskId,activityLogText,date,type,user) {
	/* var task = db.query({type: "TaskData", ID: taskId}).next();
  task.Comment.push({
    activity: activityLogText, date: date, user: currentUserEmail, type: type
//    activity: activityLogText, date: date, user: user, type: 'Update'
  });
  db.save(task);
  return taskId + ' '  + activityLogText + ' ' + date + ' ' + currentUserEmail;
}

function getActivityLogEntries(taskId) {
	/* var task = db.query({type: "TaskData", ID: taskId}).next();
  var commentArray = task.Comment;
  var returnArray = [];
  for(var i=0; i<commentArray.length; i++) {
    var current = commentArray[i];
    var num = parseInt(i) + 1;
    var user = minnow.normalizeBIAUsername(current.user);
    var type = current.type;
    var date = current.date;
    var activity = current.activity;
    returnArray.push([num,user,type,date,activity]);
  }
  return returnArray;
}

function getActivityLogEntriesFromTemplate(templateId) {
	/*var task = db.query({type: "TemplateData", TemplateID: templateId}).next();
  var commentArray = task.Comment;
  var returnArray = [];
  for(var i=0; i<commentArray.length; i++) {
    var current = commentArray[i];
    var num = parseInt(i) + 1;
    var user = current.user;
    var type = current.type;
    var date = current.date;
    var activity = current.activity;
    returnArray.push([num,user,type,date,activity]);
  }
  Logger.log(returnArray);
  return returnArray;
}

function testCreate() {
//  var thing = updateActivityLog('SMIT20140417112519','the update 2 from code','4/17/14','Update')
//  var thing = createDescriptionAndActivityLogDocument('test document from library','did some stuff','4/15/2014','cool description',['stanley.smith@bia.gov','matthew.coulon@bia.gov']);
  var thing = getActivityLogEntries('SMIT20140417112519');
  Logger.log(thing);
}

function convertNullDescriptionToString() {
	/* var query = db.query({type:"TaskData"});
  while(query.hasNext()) {
    var current = query.next();
    if(!current.Description) {
      current.Description = '';
      db.save(current);
    }
    Utilities.sleep(1000);
  }
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createNewTemplate(templateName, shared_boolean, taskName, dueDate, requestingOffice, taskOwner, assignTaskTo, priority, category, lastAction, lastActionDate, stakeholders, tags, description, files) {
  var taskCreationTime = new Date();
  var taskCreationTimeForId = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMddHHmmss");
  var email = Session.getActiveUser().getEmail();
  var emailForId = email.split('.')[1].split('@')[0].substring(0,4).toUpperCase();  
  var templateId = emailForId + taskCreationTimeForId + '-template';
  var taskDueDate = new Date(dueDate);
  var allUsers = taskOwner.concat(assignTaskTo);
  //the object to be passed to ScriptDb on Submit
  var ob = {type: "TemplateData", 
            TemplateName: templateName,
            Shared: shared_boolean,
            TemplateID: templateId, 
            Name: taskName, 
            ReqOffice: requestingOffice, 
            Owner: taskOwner,
            Assignee: assignTaskTo,
            Creator: email,
            Priority: priority,
            CreationDate: {
              timestamp: taskCreationTime.getTime(), month: taskCreationTime.getMonth(), day: taskCreationTime.getDay(), date: taskCreationTime.getDate(), year: taskCreationTime.getFullYear()
            },
            DueDate: {
              timestamp: taskDueDate.getTime(), month: taskDueDate.getMonth(), day: taskDueDate.getDay(), date: taskDueDate.getDate(), year: taskDueDate.getFullYear()
            },
            Files: files,
            Comment: [{
              activity: lastAction, date: lastActionDate, user: email, type: 'Create'
            }],
            Status: "ns",
            CompletionDate: "",
            Stakeholder: stakeholders,
            Category: category,
            Tags: tags,
            ParentID: null,
            TotalHours: 0,
            Description: description
            };
  //save that object to the db
  //db.save(ob);  
  
  //return id
  return templateId;
}

function updateEditedTemplate(templateId, templateName, shared_boolean, taskName, dueDate, requestingOffice, taskOwner, assignTaskTo, priority, category, lastAction, lastActionDate, stakeholders, tags, description, files) {
  var taskCreationTime = new Date();
  var taskCreationTimeForId = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMddHHmmss");
  var email = Session.getActiveUser().getEmail();
  var taskDueDate = new Date(dueDate);
  var allUsers = taskOwner.concat(assignTaskTo);
  //the object to be passed to ScriptDb on Submit
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  /*try {
    var update_obj = db.query({type: "TemplateData", TemplateID: templateId}).next();
    update_obj.TemplateName = templateName;
    update_obj.Shared = shared_boolean;
    update_obj.TemplateID = templateId; 
    update_obj.Name = taskName; 
    update_obj.ReqOffice = requestingOffice; 
    update_obj.Owner = taskOwner;
    update_obj.Assignee = assignTaskTo;
    update_obj.Creator = email;
    update_obj.Priority = priority;
    update_obj.DueDate = {
              timestamp: taskDueDate.getTime(), month: taskDueDate.getMonth(), day: taskDueDate.getDay(), date: taskDueDate.getDate(), year: taskDueDate.getFullYear()
            };
    update_obj.Files = files;
    update_obj.Comment = [{
              activity: lastAction, date: lastActionDate, user: email, type: 'Create'
            }];
    update_obj.Stakeholder = stakeholders;
    update_obj.Category = category;
    update_obj.Tags = tags;
    update_obj.ParentID = null;
    update_obj.Description = description;
    db.save(update_obj);    
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function fetchTemplateList(){
	/*var usertemplateList = new Array();
  var sharedtemplateList = new Array();
  var templatesList_obj = { templateLists: { user_created: [], shared: [] } };
  var user_templates_result_obj = db.query({type: "TemplateData", Creator: currentUserEmail});
  var shared_templates_result_obj = db.query({type: "TemplateData", Shared: true, Creator: db.not(currentUserEmail)});
      
  while (user_templates_result_obj.hasNext()) {
    var ut_current = user_templates_result_obj.next();
    var ut_currentTemplateObj = {tid: ut_current.TemplateID, tname: ut_current.TemplateName};
    usertemplateList.push(ut_currentTemplateObj);
  }
  
  while (shared_templates_result_obj.hasNext()) {
    var st_current = shared_templates_result_obj.next();
    var st_currentTemplateObj = {tid: st_current.TemplateID, tname: st_current.TemplateName};
    sharedtemplateList.push(st_currentTemplateObj);
  }
  
  templatesList_obj.templateLists.user_created = usertemplateList;
  templatesList_obj.templateLists.shared = sharedtemplateList;
  
  return templatesList_obj;
}

function getTemplateData(templateId){
  var data_array = new Array();
  /*var template_result_obj = db.query({type: "TemplateData", TemplateID: templateId});
  
  var current = template_result_obj.next();
  var attachments_array = new Array();
  for(var i=0; i<current.Files.length; i++){
    attachments_array.push([current.Files[i].name, current.Files[i].url]);
  }
  if(isNaN(current.DueDate.timestamp)){
    var dueDate = '';
  } else {
    dueDate = new Date(current.DueDate.timestamp);
    dueDate = createMM_DD_YYYYFromDate(dueDate);
  }
        
  var valuesObject = {
    TemplateName: current.TemplateName,
    TemplateID: current.TemplateID,
    Shared: current.Shared,
    Name: current.Name,
    dueDate: dueDate,
    Assignee: current.Assignee,
    Priority: current.Priority,
    Status: current.Status,
    Files: attachments_array,
    ReqOffice: current.ReqOffice,
    Category: current.Category,
    Tags: current.Tags,
    Comment: current.Comment,
    Stakeholder: current.Stakeholder,
    TotalHours: current.TotalHours,
    Owner: current.Owner,
    Description: current.Description
  };
  
  return valuesObject;
}

function getSubFolder(child) {
  var subFolder = DocsList.getFolder('Task Documents/'+child);
  return subFolder;
}

function getActivityLogObject(id) {
	/*var query = db.query({type:"TaskData",ID:id});
  var current = query.next();
  
  return current.Comment;
}*/