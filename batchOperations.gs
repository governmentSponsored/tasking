function deleteSelectedTasks(batch_tasks_array){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    for(var i=0; i < batch_tasks_array.length; i++){
      var delete_obj = db.query({ID: batch_tasks_array[i]}).next();
      db.remove(delete_obj);
    }
    
    var returnMsg = "";
    if(batch_tasks_array.length===1) { returnMsg = "Task was deleted successfully"; } 
    else { returnMsg = "Tasks were deleted successfully"; }
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  return returnMsg;
}

function archiveAllMyTasks(){
  var task_archive_array = new Array();
  task_archive_array = getMyArchivableTasks();
  var msg = archiveSelectedTasks(task_archive_array);
  return msg;
}

function getMyArchivableTasks(){
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var activeUser = Session.getActiveUser().getEmail();
    var data_array = new Array();
    var my_created_result_obj = db.query({type: "TaskData", Creator: activeUser, Status: "cp"});
    var my_owned_result_obj = db.query({type: "TaskData", Creator: db.not(activeUser), Owner: activeUser, Status: "cp"});
    
    while (my_created_result_obj.hasNext()) {
      var current = my_created_result_obj.next();
      data_array.push(current.ID);
    }
    while (my_owned_result_obj.hasNext()) {
      var current2 = my_owned_result_obj.next();
      data_array.push(current2.ID);
    }
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  return data_array;
}

function archiveSelectedTasks(batch_tasks_array){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    for(var i=0; i < batch_tasks_array.length; i++){
      var archive_obj = db.query({ID: batch_tasks_array[i]}).next();
      archive_obj.Status = "ar";
      db.save(archive_obj);
    }    
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  var returnMsg = "";
  if(batch_tasks_array.length===0){ returnMsg = "No Completed Tasks available to Archive."; }
  else if(batch_tasks_array.length===1) { returnMsg = "Task was archived successfully"; } 
  else { returnMsg = "Tasks were archived successfully"; }
  
  return returnMsg;
}

function copySelectedTasks(batch_tasks_array){ 
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    for(var i=0; i < batch_tasks_array.length; i++){
      var archive_obj = db.query({ID: batch_tasks_array[i]}).next();
      var taskName = "Copy of " + archive_obj.Name;
      var dueDate = archive_obj.DueDate;
      var requestingOffice = archive_obj.ReqOffice;
      var taskOwner = archive_obj.Owner;
      var assignTaskTo = archive_obj.Assignee;
      var priority = archive_obj.Priority;
      var category = archive_obj.Category;
      var lastAction = archive_obj.Comment;
      var stakeholders = archive_obj.Stakeholder;
      var tags = archive_obj.Tags;
      var status = archive_obj.Status;
      var attachments = archive_obj.Files;
      var description = archive_obj.Description;
      
      //if(incomingTaskName==="many"){ taskName ="Copy of " + archive_obj.Name; } else { taskName = incomingTaskName; } //Task Name
      
      Utilities.sleep(1500); //pause to make sure ids are unique
      copyTask(taskName, dueDate, requestingOffice, taskOwner, assignTaskTo, priority, category, lastAction, stakeholders, tags, status, attachments, description);
    }    
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
  
  var returnMsg = "";
  if(batch_tasks_array.length===0){ returnMsg = "No Tasks available to Copy."; }
  else if(batch_tasks_array.length===1) { returnMsg = "Task was copied successfully"; } 
  else { returnMsg = "Tasks were copied successfully"; }
  
  return returnMsg;
}


function copyTask(taskName, dueDate, requestingOffice, taskOwner, assignTaskTo, priority, category, lastAction, stakeholders, tags, status, attachments, description) {
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
    var taskCreationTime = new Date();
    var taskCreationTimeForId = Utilities.formatDate(new Date(), "America/New_York", "yyyyMMddHHmmss");
    var email = Session.getActiveUser().getEmail();
    var emailForId = email.split('.')[1].split('@')[0].substring(0,4).toUpperCase();  
    var taskId = emailForId + taskCreationTimeForId;
    //the object to be passed to ScriptDb on Submit
    var ob = {type: "TaskData", 
            ID: taskId, 
            Name: taskName, 
            ReqOffice: requestingOffice, 
            Owner: taskOwner,
            Assignee: assignTaskTo,
            Creator: email,
            Priority: priority,
            CreationDate: {
              timestamp: taskCreationTime.getTime(), month: taskCreationTime.getMonth(), day: taskCreationTime.getDay(), date: taskCreationTime.getDate(), year: taskCreationTime.getFullYear()
            },
            DueDate: dueDate,
            Files: attachments,
            Comment: lastAction,
            Status: "ns", //override to ns
            CompletionDate: "",
            Stakeholder: stakeholders,
            Category: category,
            Tags: tags,
            ParentID: null,
            TotalHours: 0,
            Description: description
            };
    //save that object to the db
    db.save(ob);  
  } finally { // make sure it gets released even if we blow up
    lock.releaseLock();
  }
}
