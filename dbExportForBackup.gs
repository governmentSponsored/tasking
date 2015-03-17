/**
 * Exports the contents of the ScriptDB database to a series of JSON files.
 * Each export has its own folder, and the files in that folder contain the
 * JSON equivalents of each record, one record per line. If the export
 * function times out before it can complete, this function throws an error
 * instructing you to run the function again so that it can pick up where it
 * left off.
 */
function exportScriptDb() {
  // The name of the folder to export to. Change as needed.
  var EXPORT_FOLDER_NAME = 'Export-' + new Date().toISOString();

  // The name of the property that holds the next page number to export.
  var PAGE_NUMBER_PROPERTY = 'scriptDbExport.pageNumber';

  // The name of the property that holds the ID of the folder to export to.
  var FOLDER_ID_PROPERTY = 'scriptDbExport.folderId';

  // The amount of time, in milliseconds, that the script can run for before
  // it is stopped (5 minutes).
  var TIMEOUT_MS = 5 * 60 * 1000;

  // The number of records to export to a single file.
  var PAGE_SIZE = 1000;

  var properties = PropertiesService.getScriptProperties();

  var folderId = properties.getProperty(FOLDER_ID_PROPERTY);
  var folder;
  if (folderId) {
    folder = DocsList.getFolderById(folderId);
  } else {
    folder = DocsList.createFolder(EXPORT_FOLDER_NAME);
    properties.setProperty(FOLDER_ID_PROPERTY, folder.getId());
  }

  var pageNumber = properties.getProperty(PAGE_NUMBER_PROPERTY) || 0;
  var db = ScriptDb.getMyDb();
  var now = new Date();
  var finished = false;

  for (var start = new Date().getTime(); now - start < TIMEOUT_MS;
      now = new Date()) {
    var page = db.query({}).paginate(pageNumber, PAGE_SIZE);
    if (page.getSize() == 0) {
      finished = true;
      break;
    }
    var results = [];
    while (page.hasNext()) {
      var item = page.next();
      results.push(item.toJson());
    }
    var content = results.join('\n');
    var fileName = Utilities.formatString('part-%03d.json', pageNumber);
    folder.createFile(fileName, content, 'application/json');
    pageNumber++;
    properties.setProperty(PAGE_NUMBER_PROPERTY, pageNumber);
  }
  if (finished) {
    Logger.log('Export complete');
    properties.deleteProperty(FOLDER_ID_PROPERTY);
    properties.deleteProperty(PAGE_NUMBER_PROPERTY);
  } else {
    throw 'Export timed out. Run the function again to continue.';
  }
}