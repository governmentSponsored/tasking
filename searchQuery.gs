function getSearchResults(term) {
  //term = 'test';
  //term = 'oonga boonga';
  var currentUser = Session.getActiveUser().getEmail();
  term = term.toLowerCase();
  var createOwnResultsArray = [];
  var assigneeResultsArray = [];
  var data = db.query({type: "TaskData" });
  while(data.hasNext()) {
    var current = data.next();
    for(var k = 0; k < current.Assignee.length; k++) {
      if(currentUser === current.Creator || currentUser === current.Owner) {
        createOwnResultsArray.push([current.ID, current.Name.toLowerCase()]);
        createOwnResultsArray.push([current.ID, current.Tags.toLowerCase()]);
      } else if(currentUser === current.Assignee[k]) {
        assigneeResultsArray.push([current.ID, current.Name.toLowerCase()]);
        assigneeResultsArray.push([current.ID, current.Tags.toLowerCase()]);
      }
    }
  }
  var helperArray = [];
  for(var i = 0; i < createOwnResultsArray.length; i++) {
    for(var j = 0; j < createOwnResultsArray[i].length; j++) {
      var index = createOwnResultsArray[i][j].indexOf(term);
      if (index > -1) {
        helperArray.push(createOwnResultsArray[i][0]);
      }
    }
  }
  createOwnResultsArray = helperArray.getUnique();
  var assigneeHelperArray = [];
  for(var i = 0; i < assigneeResultsArray.length; i++) {
    for(var j = 0; j < assigneeResultsArray[i].length; j++) {
      var index = assigneeResultsArray[i][j].indexOf(term);
      if (index > -1) {
        assigneeHelperArray.push(assigneeResultsArray[i][0]);
      }
    }
  }
  assigneeResultsArray = assigneeHelperArray.getUnique();
  Logger.log(createOwnResultsArray);
  Logger.log(assigneeResultsArray);
  return [createOwnResultsArray,assigneeResultsArray];
  }

function testSearchResults() {
  var arraySearch = getSearchResults('');
  //var results = getMyCreatedTasks("searchcreateown", "name", "asc", arraySearch[0]);
  //var assigneeResults = getMyCreatedTasks("searchassignee", "name", "asc", arraySearch[1]);
  //Logger.log(arraySearch);
  Logger.log('yay!');
  Logger.log(arraySearch[0]);
  Logger.log(arraySearch[1]);
  //Logger.log(results);
}