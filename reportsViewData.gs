function getMyCreatedTasks(viewType, sortWhat, sortDir, searchArray){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var activeUser = Session.getActiveUser().getEmail();
    var data_array = new Array();
    if(viewType==="mycreated"){
      var my_created_result_obj = db.query({type: "TaskData", Creator: activeUser});
      var my_owned_result_obj = db.query({type: "TaskData", Creator: db.not(activeUser)});
      
      while (my_created_result_obj.hasNext()) {
        var current = my_created_result_obj.next();
        var values_array = new Array();
        var attachments_array = new Array();
        for(var i=0; i<current.Files.length; i++){
          attachments_array.push([current.Files[i].name, current.Files[i].url]);
        }
        var dueDate = new Date(current.DueDate.timestamp);
        var creationDate = new Date(current.CreationDate.timestamp);
        var completionDate = new Date(current.CompletionDate.timestamp);
        
        values_array = [current.ID,
                        current.Name,
                        createMM_DD_YYYYFromDate(dueDate),
                        current.Assignee,
                        current.Priority,
                        current.Status,
                        attachments_array,
                        current.ReqOffice,
                        current.Category,
                        current.Tags,
                        current.Comment,
                        current.Stakeholder,
                        current.TotalHours,
                        current.Owner,
                        viewType,
                        current.Creator,
                        createMM_DD_YYYYFromDate(creationDate),
                        createMM_DD_YYYYFromDate(completionDate),
                        current.Assignee[0],
                        current.Description,
                        current.Owner[0]];
        
        data_array.push(values_array);
      }
      
      while (my_owned_result_obj.hasNext()) {
        var current2 = my_owned_result_obj.next();
        var values_array2 = new Array();
        var attachments_array2 = new Array();
        var oflag = false;
        var ownerIdx= -1;
        
        for(var j = 0; j < current2.Owner.length; j++) { // <-- see if person exists in assignee array
          if(current2.Owner[j] === currentUserEmail) { oflag = true; ownerIdx = j; break; }
        }
        
        if(oflag===true){
          for(var i=0; i<current2.Files.length; i++){
            attachments_array2.push([current2.Files[i].name, current2.Files[i].url]);
          }           
          var dueDate2 = new Date(current2.DueDate.timestamp);
          var creationDate2 = new Date(current2.CreationDate.timestamp);
          var completionDate2 = new Date(current2.CompletionDate.timestamp);
        
          values_array2 = [current2.ID,
                           current2.Name,
                           createMM_DD_YYYYFromDate(dueDate2),
                           current2.Assignee,
                           current2.Priority,
                           current2.Status,
                           attachments_array2,
                           current2.ReqOffice,
                           current2.Category,
                           current2.Tags,
                           current2.Comment,
                           current2.Stakeholder,
                           current2.TotalHours,
                           current2.Owner,
                           viewType,
                           current2.Creator,
                           createMM_DD_YYYYFromDate(creationDate2),
                           createMM_DD_YYYYFromDate(completionDate2),
                           current2.Assignee[0],
                           current2.Description,
                           current2.Owner[0]];
        
          data_array.push(values_array2);
        }
      }
    } else if(viewType==="myassigned") {
      Logger.log("View type is myassigned");
      var my_assignments_result_obj = db.query({type: "TaskData"});
      while (my_assignments_result_obj.hasNext()) {
        var current3 = my_assignments_result_obj.next();
        var values_array3 = new Array();
        var attachments_array3 = new Array();
        var flag = false;
        var assigneeIdx= -1;
        
        for(var j = 0; j < current3.Assignee.length; j++) { // <-- see if person exists in assignee array
          if(current3.Assignee[j] === currentUserEmail) { flag = true; assigneeIdx = j; break; }
        }
        
        if(flag===true){
          for(var i=0; i<current3.Files.length; i++){
            attachments_array3.push([current3.Files[i].name, current3.Files[i].url]);
          }     
          var dueDate3 = new Date(current3.DueDate.timestamp);
          var creationDate3 = new Date(current3.CreationDate.timestamp);
          var completionDate3 = new Date(current3.CompletionDate.timestamp);
          
          values_array3 = [current3.ID,
                           current3.Name,
                           createMM_DD_YYYYFromDate(dueDate3),
                           //current3.Assignee[assigneeIdx],
                           current3.Assignee,
                           current3.Priority,
                           current3.Status,
                           attachments_array3,
                           current3.ReqOffice,
                           current3.Category,
                           current3.Tags,
                           current3.Comment,
                           current3.Stakeholder,
                           current3.TotalHours,
                           current3.Owner,
                           viewType,
                           current3.Creator,
                           createMM_DD_YYYYFromDate(creationDate3),
                           createMM_DD_YYYYFromDate(completionDate3),
                           current3.Assignee[0],
                           current3.Description,
                           current3.Owner[0]];
          
          data_array.push(values_array3);
        }      
      }
    } else if(viewType==="searchcreateown" && searchArray != undefined && searchArray.length > 0) {
      var search_result_obj = db.query({type: "TaskData", ID: db.anyOf(searchArray)});
      while (search_result_obj.hasNext()) {
        var current4 = search_result_obj.next();
        var values_array4 = new Array();
        var attachments_array4 = new Array();
        for(var i=0; i<current4.Files.length; i++){
          attachments_array4.push([current4.Files[i].name, current4.Files[i].url]);
        }     
        var dueDate4 = new Date(current4.DueDate.timestamp);
        var creationDate4 = new Date(current4.CreationDate.timestamp);
        var completionDate4 = new Date(current4.CompletionDate.timestamp);
        
        values_array4 = [current4.ID,
                         current4.Name,
                         createMM_DD_YYYYFromDate(dueDate4),
                         current4.Assignee,
                         current4.Priority,
                         current4.Status,
                         attachments_array4,
                         current4.ReqOffice,
                         current4.Category,
                         current4.Tags,
                         current4.Comment,
                         current4.Stakeholder,
                         current4.TotalHours,
                         current4.Owner,
                         viewType,
                         current4.Creator,
                         createMM_DD_YYYYFromDate(creationDate4),
                         createMM_DD_YYYYFromDate(completionDate4),
                         current4.Assignee[0],
                         current4.Description,
                         current4.Owner[0]];
        
        data_array.push(values_array4);
      }
    } else if(viewType==="searchassignee" && searchArray.length > 0) {
      var search_result_obj = db.query({type: "TaskData", ID: db.anyOf(searchArray)});
      while (search_result_obj.hasNext()) {
        var current5 = search_result_obj.next();
        var values_array5 = new Array();
        var attachments_array5 = new Array();
        for(var i=0; i<current5.Files.length; i++){
          attachments_array5.push([current5.Files[i].name, current5.Files[i].url]);
        }     
        var dueDate5 = new Date(current5.DueDate.timestamp);
        var creationDate5 = new Date(current5.CreationDate.timestamp);
        var completionDate5 = new Date(current5.CompletionDate.timestamp);
        
        values_array5 = [current5.ID,
                         current5.Name,
                         createMM_DD_YYYYFromDate(dueDate5),
                         current5.Assignee,
                         current5.Priority,
                         current5.Status,
                         attachments_array5,
                         current5.ReqOffice,
                         current5.Category,
                         current5.Tags,
                         current5.Comment,
                         current5.Stakeholder,
                         current5.TotalHours,
                         current5.Owner,
                         viewType,
                         current5.Creator,
                         createMM_DD_YYYYFromDate(creationDate5),
                         createMM_DD_YYYYFromDate(completionDate5),
                         current5.Assignee[0],
                         current5.Description,
                         current5.Owner[0]];
        
        data_array.push(values_array5);
      }
      
    }
    
    //Sort stuff
    if(sortWhat==="name" && sortDir==="asc"){ data_array.sortAlphaAsc(1); } else if(sortWhat==="name" && sortDir==="desc"){ data_array.sortAlphaDesc(1); } //Task Name
    else if(sortWhat==="dueDate" && sortDir==="asc"){ data_array.sortDateAsc(2); } else if(sortWhat==="dueDate" && sortDir==="desc"){ data_array.sortDateDesc(2); } //Due Date
    else if(sortWhat==="assignee" && sortDir==="asc"){ data_array.sortAlphaAsc(18); } else if(sortWhat==="assignee" && sortDir==="desc"){ data_array.sortAlphaDesc(18); } //Assignee
    else if(sortWhat==="priority" && sortDir==="asc"){ data_array.sortNumbersAsc(4); } else if(sortWhat==="priority" && sortDir==="desc"){ data_array.sortNumbersDesc(4); } //Priority
    else if(sortWhat==="status" && sortDir==="asc"){ data_array.sortAlphaAsc(5); } else if(sortWhat==="status" && sortDir==="desc"){ data_array.sortAlphaDesc(5); } //Status
    else if(sortWhat==="hours" && sortDir==="asc"){ data_array.sortNumbersAsc(12); } else if(sortWhat==="hours" && sortDir==="desc"){ data_array.sortNumbersDesc(12); } //Hours 
    else if(sortWhat==="createDate" && sortDir==="asc"){ data_array.sortDateAsc(16); } else if(sortWhat==="createDate" && sortDir==="desc"){ data_array.sortDateDesc(16); } //Date Created
    else if(sortWhat==="creator" && sortDir==="asc"){ data_array.sortAlphaAsc(15); } else if(sortWhat==="creator" && sortDir==="desc"){ data_array.sortAlphaDesc(15); } //Creator
    else if(sortWhat==="owner" && sortDir==="asc"){ data_array.sortAlphaAsc(13); } else if(sortWhat==="owner" && sortDir==="desc"){ data_array.sortAlphaDesc(13); } //Owner
    else if(sortWhat==="reqoffice" && sortDir==="asc"){ data_array.sortAlphaAsc(7); } else if(sortWhat==="reqoffice" && sortDir==="desc"){ data_array.sortAlphaDesc(7); } //Requesting Office
    else if(sortWhat==="stakeholders" && sortDir==="asc"){ data_array.sortAlphaAsc(11); } else if(sortWhat==="stakeholders" && sortDir==="desc"){ data_array.sortAlphaDesc(11); } //Stakeholders
  
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return data_array;
}

Array.prototype.sortAlphaAsc = function(i) {
  return this.sort(function(a,b){
    if (a[i].toLowerCase() < b[i].toLowerCase()) return -1;
    if (a[i].toLowerCase() > b[i].toLowerCase()) return 1;
    return 0;
  });
}

Array.prototype.sortAlphaDesc = function(i) {
  return this.sort(function(a,b){
    if (a[i].toLowerCase() < b[i].toLowerCase()) return 1;
    if (a[i].toLowerCase() > b[i].toLowerCase()) return -1;
    return 0;
  });
}

Array.prototype.sortDateAsc = function(i) {
  return this.sort(function(a,b){
    var c = new Date(a[i]);
    var d = new Date(b[i]);
    return c-d;
  });
}

Array.prototype.sortDateDesc = function(i) {
  return this.sort(function(a,b){
    var c = new Date(a[i]);
    var d = new Date(b[i]);
    return d-c;
  });
}

Array.prototype.sortDatePickerFormatAsc = function(i) {
  return this.sort(function(a,b){
    var c = createJSDateObjFromYYYY_MM_DD(a[i]);
    var d = createJSDateObjFromYYYY_MM_DD(b[i]);
    return c-d;
  });
}

Array.prototype.sortDatePickerFormatDesc = function(i) {
  return this.sort(function(a,b){
    var c = createJSDateObjFromYYYY_MM_DD(a[i]);
    var d = createJSDateObjFromYYYY_MM_DD(b[i]);
    return d-c;
  });
}

Array.prototype.sortNumbersAsc = function(i) {
  return this.sort(function(a,b){
    return a[i] - b[i];
  });
}

Array.prototype.sortNumbersDesc = function(i) {
  return this.sort(function(a,b){
    return b[i] - a[i];
  });
}

function saveTaskNameEdit(taskid, taskNameValue){
  var update_obj = db.query({ID: taskid}).next();
  update_obj.Name = taskNameValue;
  db.save(update_obj);
  
  return "Save was successful";
}

function saveTaskDescriptionEdit(taskid, newValue){
  var update_obj = db.query({ID: taskid}).next();
  update_obj.Description = newValue;
  db.save(update_obj);
  
  return "Save was successful";
}

function saveTaskDueDateChange(taskid, dueDateValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    var dueDate = createJSDateObjFromYYYY_MM_DD(dueDateValue);
    update_obj.DueDate = {
      timestamp: dueDate.getTime(), month: dueDate.getMonth(), day: dueDate.getDay(), date: dueDate.getDate(), year: dueDate.getFullYear()
    };
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveTaskAssigneeChange(taskid, assigneeValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.Assignee = assigneeValue;
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveTaskOwnerChange(taskid, ownerValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.Owner = ownerValue;
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function savePriorityChange(taskid, assigneeValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.Priority = assigneeValue;
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveStatusChange(taskid, assigneeValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.Status = assigneeValue;
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveHoursChange(taskid, hoursValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.TotalHours = hoursValue;
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveAttachmentsChange(taskid, attachValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    var attachmentsJson = [];
    for(var i=0; i<attachValue.length; i++){   
      var attachUrl = attachValue[i][1];
      
      attachmentsJson.push({name: attachValue[i][0], url: attachUrl});
    }
    
    update_obj.Files = attachmentsJson; 
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveMoreInfoChanges(taskid, reqOfficeVal, catVal, keywordsVal, stakeholdersVal){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    update_obj.ReqOffice = reqOfficeVal;
    update_obj.Stakeholder = stakeholdersVal;
    update_obj.Category = catVal;
    update_obj.Tags = keywordsVal;
    var owners = update_obj.Owner
    var assignees = update_obj.Assignee
    db.save(update_obj);
    
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return "Save was successful";
}

function saveCompletionDate(taskid, completeDateValue){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    var completionDate = createJSDateObjFromYYYY_MM_DD(completeDateValue);
    update_obj.CompletionDate = {
              timestamp: completionDate.getTime(), month: completionDate.getMonth(), day: completionDate.getDay(), date: completionDate.getDate(), year: completionDate.getFullYear()
            };
    db.save(update_obj);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
 
  return "Save was successful";
}


function getOwnerCreatorAssigneeForUpload(taskid) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var update_obj = db.query({ID: taskid}).next();
    var values_array = new Array();
    values_array = [    update_obj.Owner,
                        update_obj.Creator];
    for(var i = 0; i<update_obj.Assignee.length; i++) {
      values_array.push(update_obj.Assignee[i]);
    }
    values_array = values_array.getUnique();
    //Logger.log(values_array);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
    
  return values_array;
}

function updateDatesToNewFormat(){
/********** Update existing object's time information *************/

//1. Query
//2. Prepare updated values
//3. Save

  var existing_objs_results = db.query({type: "TaskData"});

  while (existing_objs_results.hasNext()) {
	var current = existing_objs_results.next();
    
	var newCreationDate = createJSDateObjFromYYYY_MM_DD(current.CreationDate);
    current.CreationDate = {
    		timestamp: newCreationDate.getTime(),  // so you can recreate the original date object
    		month: newCreationDate.getMonth(),      // 0 is January, 2 is February, etc.
    		day: newCreationDate.getDay(), // 0 is Sunday, 1 is Monday, etc.
    		date: newCreationDate.getDate(), //numerical day of the month
    		year: newCreationDate.getFullYear()   // full 4-digit year
	}
    
    if(current.DueDate.length > 0){
      var newDueDate = createJSDateObjFromYYYY_MM_DD(current.DueDate);
      current.DueDate = {
    		timestamp: newDueDate.getTime(),  // so you can recreate the original date object
    		month: newDueDate.getMonth(),      // 0 is January, 2 is February, etc.
    		day: newDueDate.getDay(), // 0 is Sunday, 1 is Monday, etc.
    		date: newDueDate.getDate(), //numerical day of the month
    		year: newDueDate.getFullYear()   // full 4-digit year
	  }
    }
    
    if(current.CompletionDate.length > 0){
      var newCompletionDate = createJSDateObjFromYYYY_MM_DD(current.CompletionDate);
      current.CompletionDate = {
    		timestamp: newCompletionDate.getTime(),  // so you can recreate the original date object
    		month: newCompletionDate.getMonth(),      // 0 is January, 2 is February, etc.
    		day: newCompletionDate.getDay(), // 0 is Sunday, 1 is Monday, etc.
    		date: newCompletionDate.getDate(), //numerical day of the month
    		year: newCompletionDate.getFullYear()   // full 4-digit year
	  }
    }

    db.save(current);
  }
}

function createJSDateObjFromYYYY_MM_DD(datePickerVal){
  Logger.log("datePickerVal: " + datePickerVal);
  var newDate_str = datePickerVal.replace(/-/g,"/");
  var newDateObj = new Date(newDate_str);
  return newDateObj;
}

function createMM_DD_YYYYFromDate(jsDateObject) {
  var dd = jsDateObject.getDate();
  var mm = jsDateObject.getMonth()+1;
  var yyyy = jsDateObject.getFullYear();
  
  if(mm < 10) { mm = "0"+mm; }
  if(dd < 10) { dd = "0"+dd; }
  
  var mmDDyyyy = mm + '/' + dd + '/' + yyyy;
  
  return mmDDyyyy;
}

function setDatePicker(dateObj){
  var month = (dateObj.getMonth()+1); if(month < 10){ month = "0"+month; }
  var day =  dateObj.getDate(); if(day < 10){ day = "0"+day; }
  var datePickerVal = dateObj.getFullYear() + "-" + month + "-" + day;
  return datePickerVal;
}

function getWeeklyReportDateParams(){
  var today = new Date();
  var d=today.getDay();
  var dateLower = new Date();
  var dateUpper = new Date();
  
  switch (d)
    {
    case 0:
      //"Today it's Sunday";
      dateLower = dateLower.setDate(dateLower.getDate()+1);
      dateUpper = dateUpper.setDate(dateUpper.getDate()+5);
      break;
    case 1:
      //"Today it's Monday";
      dateLower = dateLower.setDate(dateLower.getDate());
      dateUpper = dateUpper.setDate(dateUpper.getDate()+4);
      break;
    case 2:
      //"Today it's Tuesday";
      dateLower = dateLower.setDate(dateLower.getDate()-1);
      dateUpper = dateUpper.setDate(dateUpper.getDate()+3);
      break;
    case 3:
      //"Today it's Wednesday";
      dateLower = dateLower.setDate(dateLower.getDate()-2);
      dateUpper = dateUpper.setDate(dateUpper.getDate()+2);
      break;
    case 4:
      //"Today it's Thursday";
      dateLower = dateLower.setDate(dateLower.getDate()-3);
      dateUpper = dateUpper.setDate(dateUpper.getDate()+1);
      break;
    case 5:
      //"Today it's Friday";
      dateLower = dateLower.setDate(dateLower.getDate()-4);
      dateUpper = dateUpper.setDate(dateUpper.getDate());
      break;
    case 6:
      //"Today it's Saturday";
      dateLower = dateLower.setDate(dateLower.getDate()-5);
      dateUpper = dateUpper.setDate(dateUpper.getDate()-1);
      break;
    }
  var dateParamsObj = {datemin: dateLower, datemax: dateUpper}; 
  return dateParamsObj;
}


/********** Report Queries *************/
function getWeeklyPendingSummaryDataTable(pendingDataArray){ 
  var msgHtml = "";
  
  msgHtml+= "<fieldset style='padding:4px;'>"+
         "<legend style='color:#888;'>All PENDING Tasks</legend>";
  
  if(pendingDataArray.length < 1){
    msgHtml += "<div style='color:#888;'>Nothing to display.</div>";
  } else {
    msgHtml += "<table cellpadding='0' cellspacing='0' border='0' style='border-color:#dbdbdb; width:100%;'>"+
         "  <thead style='background-color:#fff2cd;'>"+
         "    <tr>"+
         "      <th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Task Name</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Due Date</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Assignee</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Creator</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Owner</th><th style='padding:1px; border:solid 1px #dbdbdb;'>Priority</th>"+
         "    </tr>"+
         "  </thead>"+
         "  <tbody>";
    //Loop for PENDING
    for(var i=0; i<pendingDataArray.length; i++){ 
      var rowColor = "#fff";
      if(i%2===0){ rowColor = "#fff"; } else { rowColor = "#efefef"; }
      var priorityDisplay = "";
      if(pendingDataArray[i][5]==1){ priorityDisplay = "Low"; } else if(pendingDataArray[i][5]==2){ priorityDisplay = "Medium"; } else if(pendingDataArray[i][5]==3){ priorityDisplay = "High"; }
    
      msgHtml += "    <tr>"+
                   "      <td style='text-align:left; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ pendingDataArray[i][0] +"</td>"+ //Task Name 
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ pendingDataArray[i][1] +"</td>"+ //Due Date
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ pendingDataArray[i][2] +"</td>"+ //Assignee
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ pendingDataArray[i][3] +"</td>"+ //Creator
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ pendingDataArray[i][4] +"</td>"+ //Owner
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; padding:2px; background-color:" + rowColor + ";'>"+ priorityDisplay +"</td>"+ //Priority
                   "    </tr>";
    }   
      msgHtml += 
         "  </tbody>"+
         "</table>";
  }
  msgHtml += "</fieldset>";
  
  return msgHtml;
}

function getWeeklyCompletedSummaryDataTable(completedDataArray){
  var msgHtml = "";
  
  msgHtml += "<fieldset style='padding:4px;'>"+
         "<legend style='color:#888;'>Tasks COMPLETED this Week</legend>";
  
  if(completedDataArray.length < 1){
    msgHtml += "<div style='color:#888;'>Nothing to display.</div>";
  } else {
    msgHtml += "<table cellpadding='0' cellspacing='0' border='0' style='border-color:#dbdbdb; width:100%;'>"+
         "  <thead style='background-color:#d9ead3;'>"+
         "    <tr>"+
         "      <th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Task Name</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Completion Date</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Due Date</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Assignee</th><th style='padding:1px; border:solid 1px #dbdbdb; border-right:none;'>Owner</th><th style='padding:1px; border:solid 1px #dbdbdb;'>Priority</th>"+
         "    </tr>"+
         "  </thead>"+
         "  <tbody>";
  
    //Loop for COMPLETED
      for(var j=0; j<completedDataArray.length; j++){ 
        var rowColor = "#fff";
        if(j%2===0){ rowColor = "#fff"; } else { rowColor = "#efefef"; }
        var priorityDisplay = "";
        if(completedDataArray[j][5]==1){ priorityDisplay = "Low"; } else if(completedDataArray[j][5]==2){ priorityDisplay = "Medium"; } else if(completedDataArray[j][5]==3){ priorityDisplay = "High"; }
    
        msgHtml += "    <tr>"+
                   "      <td style='text-align:left; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ completedDataArray[j][0] +"</td>"+ //Task Name 
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ completedDataArray[j][1] +"</td>"+ //Completion Date
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ completedDataArray[j][2] +"</td>"+ //Due Date
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ completedDataArray[j][3] +"</td>"+ //Assignee
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; border-right:none; padding:2px; background-color:" + rowColor + ";'>"+ completedDataArray[j][4] +"</td>"+ //Owner
                   "      <td style='text-align:center; border:solid 1px #dbdbdb; border-top:none; padding:2px; background-color:" + rowColor + ";'>"+ priorityDisplay +"</td>"+ //Priority
                   "    </tr>";
      }   
      msgHtml += 
         "  </tbody>"+
         "</table>";
  }
  msgHtml += "</fieldset>";
  
  return msgHtml;
}

function testJunk(){
  var data = getThisWeeksCompletedTasks_Owner("matthew.coulon@bia.gov");
  Logger.log(data);
}

//-- Open Tasks
//---- Weekly
function getOpenTasks_Creator(user){
  var thisWeekDate = new Date();
  var params = getWeeklyReportDateParams();
  var data = getOpenTasks_ForCreators(user);
  return data;
}

function getOpenTasks_Owner(user){
  var thisWeekDate = new Date();
  var params = getWeeklyReportDateParams();
  var data = getOpenTasks_ForOwners(user);
  return data;
}

function getOpenTasks_Assignee(user){
  var thisWeekDate = new Date();
  var params = getWeeklyReportDateParams();
  var data = getOpenTasks_ForAssignees(user);
  return data;
}

function testTomorrow(){
  Logger.log(getTomorrowsDueTasks_Assignee("matthew.coulon@bia.gov"));
}

//---- Tomorrows
function getTomorrowsDueTasks_Owner(user){
  var dateLower = new Date();
  var dateUpper = new Date();
  dateLower = dateLower.setDate(dateLower.getDate());
  dateUpper = dateUpper.setDate(dateUpper.getDate()+1);
  var data = getComingDueTasksDuringSpecifiedPeriod_ForOwners(user, dateLower, dateUpper);
  return data;
}

function getTomorrowsDueTasks_Assignee(user){
  var dateLower = new Date();
  var dateUpper = new Date();
  dateLower = dateLower.setDate(dateLower.getDate());
  dateUpper = dateUpper.setDate(dateUpper.getDate()+1);
  var data = getComingDueTasksDuringSpecifiedPeriod_ForAssignees(user, dateLower, dateUpper);
  return data;
}

//-- Completed Tasks
//function getThisWeeksCompletedTasks_Creator(user){
//  var thisWeekDate = new Date();
//  var params = getWeeklyReportDateParams();
//  var data = getCompletedTasksDuringSpecifiedPeriod(user, params.datemin, params.datemax);
//  return data;
//}

function getThisWeeksCompletedTasks_Owner(user){
  var params = getWeeklyReportDateParams();
  var data = getCompletedTasksDuringPeriod_ForOwners(user, params.datemin, params.datemax);
  return data;
}

function getThisWeeksCompletedTasks_Assignee(user){
  var params = getWeeklyReportDateParams();
  var data = getCompletedTasksDuringPeriod_ForAssignees(user, params.datemin, params.datemax);
  return data;
}

function getOpenTasks_ForOwners(user){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    var openThisWeekResults = db.query({type: "TaskData", 
                                        Creator: user, 
                                        Status: db.anyOf(["ns", "sd"]) });
    var openThisWeekResultsPart2 = db.query({type: "TaskData", 
                                             Creator: db.not(user), 
                                             Status: db.anyOf(["ns", "sd"]) });    
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var ownerIdx= -1;
        
      for(var j = 0; j < current.Owner.length; j++) { // <-- see if person exists in assignee array
        if(current.Owner[j] === user) { flag = true; ownerIdx = j; break; }
      }
        
      if(flag===true){      
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }
    
    while (openThisWeekResultsPart2.hasNext()) {
      var current2 = openThisWeekResultsPart2.next();
      var values_array2 = new Array();
      var flag2 = false;
      var ownerIdx2= -1;
        
      for(var k = 0; k < current2.Owner.length; k++) { // <-- see if person exists in assignee array
        if(current2.Owner[k] === user) { flag2 = true; ownerIdx2 = k; break; }
      }
        
      if(flag2===true){ 
        if(current2.DueDate.timestamp != undefined) { 
          var dueDateDisplay2 = new Date(current2.DueDate.timestamp);
          var dueDateDisplayOut2 = Utilities.formatDate(dueDateDisplay2, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut2 = "-";
        }
        
        values_array2 = [current2.Name,
                         dueDateDisplayOut2,
                         current2.Assignee,
                         current2.Creator,
                         current2.Owner,
                         current2.Priority];
        
        data_array.push(values_array2);
      }
    }      
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }  
  return data_array;
}

function getOpenTasks_ForCreators(user){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    var openThisWeekResults = db.query({type: "TaskData", 
                                        Creator: user, 
                                        Status: db.anyOf(["ns", "sd"]) });  
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
    
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
    }
        
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }  
  return data_array;
}

function getOpenTasks_ForAssignees(user){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    var openThisWeekResults = db.query({type: "TaskData", 
                                        Status: db.anyOf(["ns", "sd"]) });   
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var idx= -1;
        
      for(var j = 0; j < current.Assignee.length; j++) { // <-- see if person exists in assignee array
        if(current.Assignee[j] === user) { flag = true; idx = j; break; }
      }
        
      if(flag===true){      
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }    
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }  
  return data_array;
}


//-- Large data processing
//role can be creator, owner, or assignee
function getOpenTasksDuringSpecifiedPeriod(user, role, monthMin, monthMax, dateMin, dateMax, yearMin, yearMax){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
  
    if(role==="creator"){ Logger.log("Creator"); var openThisWeekResults = db.query({type: "TaskData", Creator: user, CreationDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, Status: db.anyOf(["ns", "sd"]) }); }
    else if(role==="owner") { var openThisWeekResults = db.query({type: "TaskData", Creator: user, CreationDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, Status: db.anyOf(["ns", "sd"]) });
                           var openThisWeekResultsPart2 = db.query({type: "TaskData", Creator: db.not(user), Owner: user, CreationDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, Status: db.anyOf(["ns", "sd"]) });
                          }
    else if(role==="assignee") { var openThisWeekResults = db.query({type: "TaskData", CreationDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, Status: db.anyOf(["ns", "sd"]) }); }
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var assigneeIdx= -1;
        
      for(var j = 0; j < current.Assignee.length; j++) { // <-- see if person exists in assignee array
          if(current.Assignee[j] === user) { flag = true; assigneeIdx = j; break; }
      }
        
      if(flag===true){    
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }
  
    if(role==="owner"){
      while (openThisWeekResultsPart2.hasNext()) {
        var current2 = openThisWeekResultsPart2.next();
        var values_array2 = new Array();
      /*var attachments_array2 = new Array();
      for(var i=0; i<current2.Files.length; i++){
      attachments_array2.push([current2.Files[i].name, current2.Files[i].url]);
      }*/
      
        if(current2.DueDate.timestamp != undefined) { 
          var dueDateDisplay2 = new Date(current2.DueDate.timestamp);
          var dueDateDisplayOut2 = Utilities.formatDate(dueDateDisplay2, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut2 = "-";
        }
      
        values_array2 = [current2.Name,
                       dueDateDisplayOut2,
                       current2.Assignee,
                       current2.Creator,
                       current2.Owner,
                       current2.Priority];
      
        data_array.push(values_array2);
      }      
    }
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return data_array;
}


function getCompletedTasksDuringPeriod_ForOwners(user, dateMin, dateMax){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    
    var thisWeekResults = db.query({type: "TaskData",  
                                    Creator: user,
                                    CompletionDate: {timestamp: db.between(dateMin, dateMax)}, 
                                  Status: "cp" });
    var thisWeekResultsPart2 = db.query({type: "TaskData", 
                                         Creator: db.not(user), 
                                         CompletionDate: {timestamp: db.between(dateMin, dateMax)}, 
                                         Status: "cp" });
    
    while (thisWeekResults.hasNext()) {
      var current = thisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var idx= -1;
        
      for(var j = 0; j < current.Owner.length; j++) { // <-- see if person exists in assignee array
          if(current.Owner[j] === user) { flag = true; idx = j; break; }
      }
        
      if(flag===true){      
        if(current.CompletionDate.timestamp != undefined) { 
          var completionDateDisplay = new Date(current.CompletionDate.timestamp);
          var completionDateDisplayOut = Utilities.formatDate(completionDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else { 
          var completionDateDisplayOut = "-"; 
        }
        
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        completionDateDisplayOut,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }
    
    while (thisWeekResultsPart2.hasNext()) {
      var current2 = thisWeekResultsPart2.next();
      var values_array2 = new Array();
      var flag2 = false;
      var idx2= -1;
        
      for(var k = 0; k < current2.Owner.length; k++) { // <-- see if person exists in assignee array
          if(current2.Owner[k] === user) { flag2 = true; idx2 = k; break; }
      }
        
      if(flag2===true){         
        if(current2.CompletionDate.timestamp != undefined) { 
          var completionDateDisplay2 = new Date(current2.CompletionDate.timestamp);
          var completionDateDisplayOut2 = Utilities.formatDate(completionDateDisplay2, "America/New_York", "MM/dd/yyyy");
        } else { 
          var completionDateDisplayOut2 = "-"; 
        }
        
        if(current2.DueDate.timestamp != undefined) { 
          var dueDateDisplay2 = new Date(current2.DueDate.timestamp);
          var dueDateDisplayOut2 = Utilities.formatDate(dueDateDisplay2, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut2 = "-";
        }
        
        values_array2 = [current2.Name,
                         completionDateDisplayOut2,
                         dueDateDisplayOut2,
                         current2.Assignee,
                         current2.Owner,
                         current2.Priority];
        
        data_array.push(values_array2);
      }
    }      
    data_array.sortDateDesc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return data_array;
}

function getCompletedTasksDuringPeriod_ForAssignees(user, dateMin, dateMax){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    
    var thisWeekResults = db.query({type: "TaskData",
                                    Creator: user, 
                                    CompletionDate: {timestamp: db.between(dateMin, dateMax)}, 
                                    Status: "cp" });
    
    while (thisWeekResults.hasNext()) {
      var current = thisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var idx= -1;
        
      for(var j = 0; j < current.Assignee.length; j++) { // <-- see if person exists in assignee array
          if(current.Assignee[j] === user) { flag = true; idx = j; break; }
      }
        
      if(flag===true){      
        if(current.CompletionDate.timestamp != undefined) { 
          var completionDateDisplay = new Date(current.CompletionDate.timestamp);
          var completionDateDisplayOut = Utilities.formatDate(completionDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else { 
          var completionDateDisplayOut = "-"; 
        }
        
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        completionDateDisplayOut,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }    
    data_array.sortDateDesc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  return data_array;
}


function getComingDueTasksDuringSpecifiedPeriod_ForOwners(user, dateMin, dateMax){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    var openThisWeekResults = db.query({type: "TaskData", 
                                          Creator: user, 
                                          DueDate: {timestamp: db.between(dateMin, dateMax)},
                                          //DueDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, 
                                          Status: db.anyOf(["ns", "sd"]) 
                                        });
    var openThisWeekResultsPart2 = db.query({type: "TaskData", 
                                               Creator: db.not(user), 
                                               DueDate: {timestamp: db.between(dateMin, dateMax)},
                                               //DueDate: {month: db.between(monthMin, monthMax), date: db.between(dateMin, dateMax), year: db.between(yearMin, yearMax)}, 
                                               Status: db.anyOf(["ns", "sd"]) 
                                              });
    
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var ownerIdx= -1;
        
      for(var j = 0; j < current.Owner.length; j++) { // <-- see if person exists in assignee array
        if(current.Owner[j] === user) { flag = true; ownerIdx = j; break; }
      }
        
      if(flag===true){      
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }
    
    while (openThisWeekResultsPart2.hasNext()) {
      var current2 = openThisWeekResultsPart2.next();
      var values_array2 = new Array();
      var flag2 = false;
      var ownerIdx2= -1;
        
      for(var k = 0; k < current2.Owner.length; k++) { // <-- see if person exists in assignee array
        if(current2.Owner[k] === user) { flag2 = true; ownerIdx2 = k; break; }
      }
        
      if(flag2===true){ 
        if(current2.DueDate.timestamp != undefined) { 
          var dueDateDisplay2 = new Date(current2.DueDate.timestamp);
          var dueDateDisplayOut2 = Utilities.formatDate(dueDateDisplay2, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut2 = "-";
        }
        
        values_array2 = [current2.Name,
                         dueDateDisplayOut2,
                         current2.Assignee,
                         current2.Creator,
                         current2.Owner,
                         current2.Priority];
        
        data_array.push(values_array2);
      }
    }      
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }  
  return data_array;
}

function getComingDueTasksDuringSpecifiedPeriod_ForAssignees(user, dateMin, dateMax){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var data_array = new Array();
    var openThisWeekResults = db.query({type: "TaskData", 
                                        DueDate: {timestamp: db.between(dateMin, dateMax)},
                                        Status: db.anyOf(["ns", "sd"]) 
                                      });    
    while (openThisWeekResults.hasNext()) {
      var current = openThisWeekResults.next();
      var values_array = new Array();
      var flag = false;
      var ownerIdx= -1;
        
      for(var j = 0; j < current.Assignee.length; j++) { // <-- see if person exists in assignee array
        if(current.Assignee[j] === user) { flag = true; ownerIdx = j; break; }
      }
        
      if(flag===true){      
        if(current.DueDate.timestamp != undefined) { 
          var dueDateDisplay = new Date(current.DueDate.timestamp);
          var dueDateDisplayOut = Utilities.formatDate(dueDateDisplay, "America/New_York", "MM/dd/yyyy");
        } else {
          var dueDateDisplayOut = "-";
        }
        
        values_array = [current.Name,
                        dueDateDisplayOut,
                        current.Assignee,
                        current.Creator,
                        current.Owner,
                        current.Priority];
        
        data_array.push(values_array);
      }
    }
          
    data_array.sortDateAsc(1);
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }  
  return data_array;
}