ds.Group.all()
ds.User.all()
var fellow = ds.User({name:'konley@data-mosaic.com'})
fellow
fellow.Group = '507B3E5F9AD04640BF010C95247A4934'
fellow.save();
