function timeElapsed( dateBegin, dateEnd )
{
	var mydur = dateEnd - dateBegin;
	
	var millisecs = mydur % 1000;
	mydur = ( mydur - millisecs ) / 1000;  // ms to secs
	var secs = mydur % 60;
	mydur = ( mydur - secs ) / 60;  // secs to mins
	var mins = mydur % 60;
	mydur = ( mydur - mins ) / 60;  // min to hours
	var hours = mydur % 24;
	mydur = ( mydur - hours ) / 24;  // hours to days
	var days = mydur;
	
	var mystr = days > 0                                      ? ( days  + "d " ) : "";
	mystr +=    days > 0 || hours > 0                         ? ( hours + "h " ) : "";
	mystr +=    days > 0 || hours > 0 || mins > 0             ? ( mins  + "m " ) : "";
	mystr +=    days > 0 || hours > 0 || mins > 0 || secs > 0 ? ( secs  + "s"  ) : "0";
	return mystr;
}

var beg = new Date( 2015, 6, 18, 3, 4, 5 );
var end = new Date( 2015, 6, 18, 3, 4, 6 );  // month is zero-based
var end2 = Date.now();
var end3 = new Date();

var elapsed = timeElapsed( beg, end );
elapsed
