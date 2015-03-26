function serverFunc(theForm) {
  var folderName = '';
  var nameUrlPair_array = [];
  var taskName = theForm.taskName;
  if(taskName == '') { 
    taskName = 'New Task';
  } 
  var folder = DocsList.createFolder(taskName);
  var fileBlob = theForm.attachment_file;
  var adoc = DocsList.createFile(fileBlob);
  
  adoc.addToFolder(folder);
  nameUrlPair_array.push(adoc.getName(), adoc.getUrl());
  var documentId = adoc.getId();
  return nameUrlPair_array;
}

function uploadFile(form) {  
	//declare variables
	var taskFolder,
	urlAndName = [],
	fileBlob = form.documentUpload,
	document,
	rootFolder;
	
	//see if folder exists. if not, then create one.
	try {
	  taskFolder = DocsList.getFolder('Task Documents');
	} catch(e) {
	  taskFolder = DocsList.createFolder('Task Documents');
	}
	
	//create the file
	document = DocsList.createFile(fileBlob);
	
	//remove from root folder and add to Task Documents one.
	rootFolder = DocsList.getRootFolder();
	document.addToFolder(taskFolder);
	document.removeFromFolder(rootFolder);
	
	//push data to be returned
	urlAndName.push(document.getName(), document.getUrl());
	
	Logger.log(urlAndName)
	return urlAndName;
  
}
/*
function createPdfFromEmail(email,taskId,include,create) {
//  var email = 'https://mail.google.com/mail/u/0/?tab=wm#all/14272673a1737bcc';
  var check = email.indexOf('https://mail.google.com/mail/');
  var returnArray = new Array();
  var attachmentArray = new Array();
  if(check > -1) {
    var threadId = email.substring(email.lastIndexOf('/')+1,email.length);
    var thread = GmailApp.getThreadById(threadId);
    var messageBody = '';
    for(var i=0; i<thread.getMessageCount(); i++) {
      var message = thread.getMessages();
      if(i===0) { var messageSubject = message[i].getSubject(); }
      var messageBody = messageBody + message[i].getBody();
      var attachments = message[i].getAttachments()
      if(attachments[0] != undefined) { attachmentArray.push(attachments); }
    }
    // Create Google Drive folder if it doesn't exist
    try {
       var folder = DocsList.getFolder("Task Documents");
    } catch(e) {
    // Folder doesn't exist
       var folder = DocsList.createFolder("Task Documents");
    }
    // Create the message PDF inside the Task Documents folder
    var htmlBodyFile = folder.createFile(messageSubject, messageBody, "text/html");
    var pdfBlob = htmlBodyFile.getAs('application/pdf');
    pdfBlob.setName("Email: " + messageSubject + ".pdf");
    var file = folder.createFile(pdfBlob);
    htmlBodyFile.removeFromFolder(folder);
    htmlBodyFile.setTrashed(true);
    //add creator/owner/assignee as editors
    var usersArray = new Array();
    if(create) {
      var usersArray = [currentUserEmail];
    } else {
      usersArray = getOwnerCreatorAssigneeForUpload(taskId);
    }
    //add attachments to Task Documents folder, add editors to the file, put them into return array
    if(include === true) {
      for(var j=0; j<attachmentArray.length; j++) {
        for(var k=0; k<attachmentArray[j].length; k++) {
          var attachment = attachmentArray[j][k].copyBlob();
          var attachmentFile = folder.createFile(attachment);
          attachmentFile.addEditors(usersArray);
          var attachmentName = attachment.getName();
          var attachmentUrl = attachmentFile.getUrl();
          returnArray.push([attachmentName,attachmentUrl]);
        }
      }
    }
    //Get ID of email message pdf for returning purposes
    var fileUrl = file.getUrl();
    var fileName = file.getName();
    file.addEditors(usersArray);
  } //end if
  returnArray.push([fileName,fileUrl]);
  Logger.log(returnArray);
  return returnArray;
}

function addUsersToDocuments(taskId,owner,creator,assignee) {
  var data = db.query({type: "TaskData", ID: taskId});
  var current = data.next();
  
  for(var i=0; i<current.Files.length; i++) {
    var docUrl = current.Files[i].url;
    var document = minnow.getGoogleDriveFileBySharingUrl(docUrl);
    if(document) {
      document.addEditors(assignee);
    }//end if
  }//end for
}
function removeUsersFromDocuments(taskId,owner,creator,assignee) {
  var data = db.query({type: "TaskData", ID: taskId});
  var current = data.next();
  for(var i=0; i<current.Files.length; i++) {
    var docUrl = current.Files[i].url;
    var document = minnow.getGoogleDriveFileBySharingUrl(docUrl);
    if(document) {
      for(var j=0; j<assignee.length; j++) {
        document.removeEditor(assignee[j]);
      }//end for
    }//end if
  }//end for
  
  return taskId + ' ' + owner +  ' ' + creator + ' ' + assignee;
}

function addAssigneesAndOwnersToDocumentsOnSave(taskId) {
  var data = db.query({type: "TaskData", ID: taskId});
  var current = data.next();
  var assignees = current.Assignee;
  var owners = current.Owner;
  for(var i=0; i<current.Files.length; i++) {
    var docUrl = current.Files[i].url;
    var document = minnow.getGoogleDriveFileBySharingUrl(docUrl);
    for(var i=0; i<current.Files.length; i++) {
      var docUrl = current.Files[i].url;
      var document = minnow.getGoogleDriveFileBySharingUrl(docUrl);
      if(document) {
        document.addEditors(assignees);
        document.addEditors(owners);
      }//end if
    }//end for
  }//end for
  return taskId + ' ' + owners + ' ' + assignees;
}*/