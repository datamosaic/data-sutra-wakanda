﻿
// whack existing data
ds.User.remove();
ds.Organization.remove();
// grab data from files
var user = Folder("/Volumes/Ice Man/stratos/prod/export/navigation/User");
var org = Folder("/Volumes/Ice Man/stratos/prod/export/navigation/Organization");
// feed it in to data store
ds.User.importFromJSON(user);
ds.Organization.importFromJSON(org);
ds.User.all();
