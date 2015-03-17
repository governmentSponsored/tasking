function testWeeklySummary_Owner(){
  var weeklyDateParams = getWeeklyReportDateParams();
  var endOfWeekDate = new Date(weeklyDateParams.datemax);
  var endOfWeekDateDisplayOut = Utilities.formatDate(endOfWeekDate, "America/New_York", "MM/dd/yyyy");
  var users = getUserObjects();
  //var users = ['matthew.coulon@bia.gov']; //for testing
  var roleText = "This is a summary of tasks you have <span style='font-weight:bold; text-decoration:underline;'>created or own</span>";
  for(var i=0;i<users.length;i++){
    var openTask_data = getOpenTasks_Owner(users[i]);
    var completedTask_data = getThisWeeksCompletedTasks_Owner(users[i]);
    //if(openTask_data.length !== 0 && completedTask_data.length !== 0 ){
      var htmlBody = getWeeklyPendingSummaryEmailMarkup(users[i], roleText, getWeeklyPendingSummaryDataTable(openTask_data), getWeeklyCompletedSummaryDataTable(completedTask_data));
    
      MailApp.sendEmail(users[i], "Summary of Tasks for Week Ending " + endOfWeekDateDisplayOut,"", {htmlBody: htmlBody, noReply: true}); 
    //}
  }
}

function testWeeklySummary_Assignee(){
  var weeklyDateParams = getWeeklyReportDateParams();
  var endOfWeekDate = new Date(weeklyDateParams.datemax);
  var endOfWeekDateDisplayOut = Utilities.formatDate(endOfWeekDate, "America/New_York", "MM/dd/yyyy");
  var users = getUserObjects();
  //var users = ['matthew.coulon@bia.gov']; //for testing
  var roleText = "This is a summary of tasks <span style='font-weight:bold; text-decoration:underline;'>assigned to you</span>";
  for(var i=0;i<users.length;i++){
    var openTask_data = getOpenTasks_Assignee(users[i]);
    var completedTask_data = getThisWeeksCompletedTasks_Assignee(users[i]);
    //if(openTask_data.length !== 0 && completedTask_data.length !== 0 ){
      var htmlBody = getWeeklyPendingSummaryEmailMarkup(users[i], roleText, getWeeklyPendingSummaryDataTable(openTask_data), getWeeklyCompletedSummaryDataTable(completedTask_data));
    
      MailApp.sendEmail(users[i], "Summary of Assignments for Week Ending " + endOfWeekDateDisplayOut,"", {htmlBody: htmlBody, noReply: true}); 
    //}
  }
}

function sendEmailAlert_DueTomorrow_Owner(){
  var today = new Date();
  var tomorrow_num = 0;
  tomorrow_num = today.setDate(today.getDate()+1);
  var tomorrow = new Date(tomorrow_num);
  var tomorrowDisplayOut = Utilities.formatDate(tomorrow, "America/New_York", "MM/dd/yyyy");
  var users = getUserObjects();
  //var users = ['matthew.coulon@bia.gov']; //for testing
  var roleText = "This is a summary of tasks that are <span style='font-weight:bold; text-decoration:underline;'>due tomorrow.</span>";
  for(var i=0;i<users.length;i++){
    var data = getTomorrowsDueTasks_Owner(users[i]);
    if(data.length > 0){
      var htmlBody = getDueTomorrowSummaryEmailMarkup(users[i], roleText, getWeeklyPendingSummaryDataTable(data));
      MailApp.sendEmail(users[i], "Summary of Tasks Due Tomorrow " + tomorrowDisplayOut,"", {htmlBody: htmlBody, noReply: true}); 
    }
  }
}

function sendEmailAlert_DueTomorrow_Assignee(){
  var today = new Date();
  var tomorrow_num = 0;
  tomorrow_num = today.setDate(today.getDate()+1);
  var tomorrow = new Date(tomorrow_num);
  var tomorrowDisplayOut = Utilities.formatDate(tomorrow, "America/New_York", "MM/dd/yyyy");
  var users = getUserObjects();
  //var users = ['matthew.coulon@bia.gov']; //for testing
  var roleText = "This is a summary of tasks assigned to you that are <span style='font-weight:bold; text-decoration:underline;'>due tomorrow.</span>";
  for(var i=0;i<users.length;i++){
    var data = getTomorrowsDueTasks_Assignee(users[i]);
    if(data.length > 0){
      var htmlBody = getDueTomorrowSummaryEmailMarkup(users[i], roleText, getWeeklyPendingSummaryDataTable(data));
      MailApp.sendEmail(users[i], "Summary of Assignments Due Tomorrow " + tomorrowDisplayOut,"", {htmlBody: htmlBody, noReply: true}); 
    }
  }
}


//-- Markup creator functions
function getWeeklyPendingSummaryEmailMarkup(user, roleText, pendingSummaryHtml, completeSummaryHtml){
  var weeklyDateParams = getWeeklyReportDateParams();
  var endOfWeekDate = new Date(weeklyDateParams.datemax);
  var endOfWeekDateDisplayOut = Utilities.formatDate(endOfWeekDate, "America/New_York", "MM/dd/yyyy");
  var msgHtml = "";
  var creatorSlashOwner = user;
  msgHtml = "<p>Hello <span style='font-weight:bold;'>" + minnow.normalizeDOIUsernames(creatorSlashOwner) + "</span>,</p>"+
    "<p>" + roleText + " as of <span style='font-weight:bold;'>week ending " + endOfWeekDateDisplayOut + "</span>. To view complete individual task information, <a href='" + appLink + "'>visit your tasking dashboard</a>.</p>";
  
  msgHtml += pendingSummaryHtml;
  msgHtml += "<br />";
  msgHtml += completeSummaryHtml;
  
  return msgHtml;
}

function getDueTomorrowSummaryEmailMarkup(user, roleText, pendingSummaryHtml){
  var weeklyDateParams = getWeeklyReportDateParams();
  var endOfWeekDate = new Date(weeklyDateParams.datemax);
  var endOfWeekDateDisplayOut = Utilities.formatDate(endOfWeekDate, "America/New_York", "MM/dd/yyyy");
  var today = new Date();
  var todayNumericalValue = today.getDate();
  var msgHtml = "";
  var creatorSlashOwner = user;
  msgHtml = "<p>Hello <span style='font-weight:bold;'>" + minnow.normalizeDOIUsernames(creatorSlashOwner) + "</span>,</p>"+
    "<p>" + roleText + " To view complete individual task information, <a href='" + appLink + "'>visit your tasking dashboard</a>.</p>";
  
  msgHtml += pendingSummaryHtml;
  
  return msgHtml;
}