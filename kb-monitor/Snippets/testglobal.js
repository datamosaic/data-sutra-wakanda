if(1)
{
	var givenSSHkey = "1714";
	var globaldata = ds.MyGlobalSettings.all();
	var globalrec = globaldata.length == 1 ? globaldata[0] : new ds.MyGlobalSettings;
	globalrec.ssh_key = givenSSHkey;
	globalrec.save();
	//return true;
	globalrec
}
