function exportIntoSheet(type,id,documentExportType) {
  var creationTimeForTitle = Utilities.formatDate(new Date(), "America/New_York", "MMMMM, dd yyyy HH:mm aaa");
  var activeUser = Session.getActiveUser().getEmail();
  var userFirstName = activeUser.split('.')[0].capitalize();
  var userLastName = activeUser.split('.')[1].split('@')[0].capitalize();
  if (type === 'mycreated') {var partOfTitle = 'Task';} else if(type==="search"){ partOfTitle = 'Search Result'; }{partOfTitle = 'Assignment';}
  var title = 'All of ' + userFirstName + ' ' + userLastName + "'s " + partOfTitle + "s as of " + creationTimeForTitle;
  if(id==="" && type === 'mycreated') { var allTasks = getMyCreatedTasks(type, "createDate", "desc"); } 
  else if(id==="" && type === 'myassigned') {allTasks = getMyCreatedTasks(type, "dueDate", "desc");}
  else if(id==="" && type === 'search') {allTasks = getMyCreatedTasks(type, "dueDate", "desc");}
  else { 
    allTasks = [];
    for(var j = 0; j < id.length; j++){
      var query = db.query({type: "TaskData", ID:id[j]});
      var viewType = type;
        while (query.hasNext()) {
          var current = query.next();
          var values_array = new Array();
          var attachments_array = new Array();
          for(var i=0; i<current.Files.length; i++){
            attachments_array.push([current.Files[i].name, current.Files[i].url]);
          }
          var idDueDate = new Date(current.DueDate.timestamp);
          var idCreationDate = new Date(current.CreationDate.timestamp);
          var idCompletionDate = new Date(current.CompletionDate.timestamp);
          //set spreadsheet title
          if(id.length===1){ title = current.Name + ' ' + partOfTitle + ' Information for ' + userFirstName +  ' ' + userLastName +  ' as of ' + creationTimeForTitle; }
          else {
            if(type === 'mycreated'){ var beginningTitle = "My Created/Owned (" + id.length + ") "; } else if(type==="search") { beginningTitle = "My Search Results (" + id.length + ") ";} else { beginningTitle = "Assigned (" + id.length + ") "; }
            title = beginningTitle + "for "  + userFirstName +  ' ' + userLastName +  ' as of ' + creationTimeForTitle;
          }
          
          values_array = [current.ID, //0
                          current.Name,
                          setDatePicker(idDueDate),
                          current.Assignee,
                          current.Priority,
                          current.Status, //5
                          attachments_array,
                          current.ReqOffice,
                          current.Category,
                          current.Tags,
                          current.Comment, //10
                          current.Stakeholder,
                          current.TotalHours,
                          current.Owner,
                          viewType,
                          current.Creator, //15
                          setDatePicker(idCreationDate),
                          setDatePicker(idCompletionDate)];          
          allTasks.push(values_array);
        }
    }
  }
  Logger.log('all tasks: ' + allTasks)
  //variables to store values from query (BUT ONLY FOR SPREADSHEETS!!)
  if(documentExportType === 'spreadsheet') {
    var ssOriginal = DocsList.getFileById('0Am7V9MCquChqdGdjZWg5Vkh6OXcwZE91bHB1UWxxSkE');
    var ssCopy = ssOriginal.makeCopy(title);
    try{
      var folder = DocsList.getFolder('Task Documents');
    } catch(e) {
      var folder = DocsList.createFolder('Task Documents');
    }
    try{
      var subFolder = getSubFolder('Exports');
    } catch(f) {
      var subFolder = folder.createFolder('Exports');
    }
    
    ssCopy.addToFolder(subFolder);
    var rootFolder = DocsList.getRootFolder();
    ssCopy.removeFromFolder(rootFolder);
    
    var ssCopyId = ssCopy.getId();
    var ssCopyUrl = ssCopy.getUrl();
    var ss = SpreadsheetApp.openById(ssCopyId);
  } else {
    var doc = 'some doc eventually';
  }
  
  //append row with data for each task
  for(var i = 0; i < allTasks.length; i++) {
    //convert stored data into human readable data
    var taskName = allTasks[i][1]; //name
    if(allTasks[i][2].indexOf('NaN') === -1) {var dueDate = createJSDateObjFromYYYY_MM_DD(allTasks[i][2]); } else {dueDate = 'No Date'; }
    var taskDueDate = dueDate; //due date
    if(typeof allTasks[i][13] != 'string') { var taskOwner = [allTasks[i][13].join(', ')]; } else { taskOwner = [allTasks[i][13]]; } //owner
    if(typeof allTasks[i][3] != 'string') { var taskAssignee = [allTasks[i][3].join(', ')]; } else { taskAssignee = [allTasks[i][3]]; } //assignees
    var taskPriority = allTasks[i][4];    
    if(taskPriority == 3) { taskPriority = 'High';} else if(taskPriority == 2) { taskPriority = 'Medium'; } else { taskPriority = 'Low'; } //priority
    var taskStatus = allTasks[i][5];    
    if(taskStatus === 'cp') { taskStatus = 'Completed';} else if(taskStatus === 'ns') { taskStatus = 'Not Started'; } else if(taskStatus === 'sd') { taskStatus = 'Started'; } else { taskStatus = 'Archived' } //status
    if(allTasks[i][17].indexOf('NaN') === -1) {var taskCompletionDate = createJSDateObjFromYYYY_MM_DD(allTasks[i][17]); } else {taskCompletionDate = 'Not Completed'; } //completion date
    var taskTotalHours = allTasks[i][12]; //total hours
    
    //more info tab data
    var taskId = allTasks[i][0];
    var taskCreator = allTasks[i][15];
    var taskRequestingOffice = allTasks[i][7];
    var taskStakeholders = allTasks[i][11];
    var category = allTasks[i][8];
    var taskCategory = [];
    for (var j = 0; category.length > j; j++) {
      var cc = category[j]
      if(cc == 'it') { cc = 'Information Technology'; } 
      else if( cc == 'la') { cc='Legislative Affairs' } 
      else if(cc == 'ed') { cc = 'Economic Development' }
      else if(cc == 'e') { cc = 'Education' }
      else if(cc == 'fb') { cc = 'Financial/Budget' }
      else if(cc == 'g') { cc = 'Gaming' }
      else if(cc == 'hc') { cc = 'Human Capital' }
      else if(cc == 'js') { cc = 'Justice Services' }
      else if(cc == 'nr') { cc = 'Natural Resources' }
      else if(cc == 'pa') { cc = 'Public Affairs' }
      else if(cc == 't') { cc = 'Trust' }
      else { cc == 'Tribal Government' }
      taskCategory.push(cc);
    }      
    taskCategory = taskCategory.join(', ');
    var taskKeywords = allTasks[i][9];
    
    var taskActivityLog = 'Go to Activity Logs in the top menu bar and Authorize./n Go back to Activity Logs and select Create Activity Logs./n Please be patient, this may take a little while.'; //activity Log
//    var taskActivityLog = allTasks[i][10];
    
    var generalInformationTab = ss.getSheets()[0];
    var moreInformationTab = ss.getSheets()[1];
    
    generalInformationTab.appendRow([taskName, dueDate, taskOwner, taskAssignee, taskPriority, taskStatus, taskCompletionDate, taskTotalHours]);
    moreInformationTab.appendRow([taskName,taskId,taskCreator,taskRequestingOffice,taskStakeholders,taskCategory,taskKeywords,taskActivityLog]);
  }
  
  var returnTitle = title.substring(0,50);
  var returnValueURL = '<a href="' + ssCopyUrl + '" target="_blank">' + returnTitle + '</a>';
  
  return returnValueURL;  
}

function testExport() {
  var idArray = ['SMIT20140414124012']
  var returnVal = exportIntoSheet("mycreated",idArray,"spreadsheet");
  //var returnVal = getMyCreatedTasks("searchcreateown", "dueDate", "desc")
  Logger.log(returnVal);
  //Logger.log(typeof idArray);
}
function export(everything) {
  var creationTimeForTitle = Utilities.formatDate(new Date(), "America/New_York", "MMMMM, dd yyyy HH:mm aaa");
  if(everything === undefined){ var result = db.query({}); var title = 'Everything'; } else { result = db.query({type: "TaskData"}); title = 'Task Data'; }
  var data = [];
  var keys = {};

  // load in data and find out the object keys
  while (result.hasNext()) {
    var item = result.next();
    var itemKeys = Object.keys(item);
    for (var i = 0; i < itemKeys.length; i++) {
      if (typeof(item[itemKeys[i]]) != 'function') {
        keys[itemKeys[i]] = true;
      }
    }
    data.push(item);
  }

  var headings = Object.keys(keys);
  var values = [headings];
  // produce the values array containing the bits from the result
  // objects
  for (var rownum = 0 ; rownum < data.length; rownum++) {
    var thisRow = [];
    var item = data[rownum];
    for (var i = 0; i < headings.length; i++) {
      var field = headings[i];
      var thisValue = item[field];
      if (thisValue == undefined || typeof(thisValue) == 'function') {
        thisValue = null;
      } else if(thisValue instanceof Array) {
        //Logger.log(typeof thisValue[0] + ' ' + thisValue[0]);
        if(typeof thisValue[0] == 'object') { Logger.log(thisValue) }
        //thisValue = thisValue.toString();
        //if(typeof thisValue == "object") {Logger.log('rawr'); }
      }
      thisRow.push(thisValue);
    }
    values.push(thisRow);
  }
}

function exportTaskData() {
  export(true);
}

function exportEverything() {
  export();
}

function exportBackToScriptDB(id) {
  var backUpSpreadSheetID = '0Am7V9MCquChqdGU5WlgtRnVLdEtOMnVTdGRpODJjYWc';
  var spreadsheet = SpreadsheetApp.openById(backUpSpreadSheetID);
  var sheet = spreadsheet.getSheets()[0];
  var height = sheet.getRowHeight(1);
  var width = sheet.getColumnWidth(1);
  var range = sheet.getRange(1 ,1 , height, width );
  if(id === undefined) { 
    Logger.log('Do nothing'); 
  } else {
    var values = range.getValues();
    var rowNumber = '';
    for(var i = 0; i < height; i++) {
      if(values[i][17] == id) { rowNumber = i; break;}    
    }
    //fix the #REF! file values & parentID values
    if(values[rowNumber][16] == '#REF!') { values[rowNumber][16] = []; } 
    if(values[rowNumber][9] == '') { values[rowNumber][9] = null; }
    var ob = {type: "TaskData", 
              ID: values[rowNumber][17], 
              Name: values[rowNumber][12], 
              ReqOffice: values[rowNumber][18], 
              Owner: values[rowNumber][0],
              Assignee: values[rowNumber][10],
              Creator: values[rowNumber][4],
              Priority: values[rowNumber][11],
              CreationDate: values[rowNumber][7],
              DueDate: values[rowNumber][5],
              Files: values[rowNumber][16],
              Comment: values[rowNumber][6],
              Status: values[rowNumber][14],
              CompletionDate: values[rowNumber][2],
              Stakeholder: values[rowNumber][1],
              Category: values[rowNumber][15],
              Tags: values[rowNumber][13],
              ParentID: values[rowNumber][9],
              TotalHours: values[rowNumber][3],
              CreatorActionNote: values[rowNumber][19]
             };
    Logger.log(values[rowNumber][15]);
    Logger.log(ob);
    var dbDataCheck = db.query({type: "TaskData", ID: id}).next();
    Logger.log(dbDataCheck);
  }
}

function exportSingleItemToScriptDB() {
  exportBackToScriptDB('COUL20130821085853');
}

function createActivityLogDocument(name,obj) {
  var doc = DocumentApp.create('Activity Log for: ' + name);
  var docURL = doc.getUrl();
  var docID = doc.getId();
  var body = doc.getBody();
  for(var i=0; i<obj.length; i++) {
    var current = obj[i];
    var num = parseInt(i) + 1;
    var user = current.user;
    var type = current.type;
    var date = current.date;
    var activity = current.activity;
    var text = 'Activity ' + num + ' - ' + user + ' - ' + date + ' - ' + activity;
    body.appendParagraph(text);
  }
  //legend on the first line
  var legendText = 'Activity Number - User who added the activity - Activity date (optional) - Activity\n';
  var legendStyle = {};
  legendStyle[DocumentApp.Attribute.BOLD] = true;
  legendStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#C5DBEC';
  legendStyle[DocumentApp.Attribute.FONT_SIZE] = 12;
  body.getParagraphs()[0].editAsText()
                         .setAttributes(legendStyle)
                         .setText(legendText);
  
  //add file to subfolder. create if necessary.
  var document = DocsList.getFileById(docID);
  try{
    var folder = DocsList.getFolder('Task Documents');
  } catch(e) {
    var folder = DocsList.createFolder('Task Documents');
  }
  
  try{
    var subFolder = getSubFolder('Activity Logs');
  } catch(f) {
    var subFolder = folder.createFolder('Activity Logs');
  } 
    
  document.addToFolder(subFolder);
  var rootFolder = DocsList.getRootFolder();
  document.removeFromFolder(rootFolder);
  
//  var url = '=(HYPERLINK(“https://docs.google.com/a/bia.gov/document/d/' + docID + '/edit”, “Activity Log”))';
//  var url = '=(HYPERLINK("www.google.com","a"))';
  return docURL;
}