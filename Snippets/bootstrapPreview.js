// the path to get to the resources project
var codePath = ds.getModelFolder().path;

// which project is this running in?
var projPath = Folder(codePath).parent.path + 'Labels (LBL)/';

// require in bootstrap builder
var bootstrap = require(codePath + "Extensions/builders/bootstrap/bootstrap.js");

// run the bootstrap builder
var results = bootstrap.preview(File(Folder(codePath).parent.path + 'Labels (LBL)/WebFolder/src/pages/logintest.waPage/form.waComponent/form.html'));

results