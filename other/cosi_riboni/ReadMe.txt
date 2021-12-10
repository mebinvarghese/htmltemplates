/********************************************************************************************
*								AIVPOS Installation	dependencies							*
********************************************************************************************/
Download and install latest QZ Tray 2.x version from https://qz.io/download/ and latest Java JDK

For setting up CallerID,
	Download and setup 
		http://capturltd.co.uk/POS/CallerID/com0com-3.0.0.0-i386-and-x64-signed.zip
										OR 
		http://capturltd.co.uk/POS/CallerID/com0com-3.0.0.0-i386-and-x64-unsigned.zip
	Download Captur calledID from http://capturltd.co.uk/POS/CallerID/CapturLtdCallerID.zip , copy to AIVPOS root folder and run CapturCallerID executable
	
For Table POS installation,
	Set static local IP for local server
	Check and install curl
	Install couchDB to C:\CouchDB (path should be strictly this)
	Add Inbound Firewall rule for port 5984
	Configure couchDB from http://localhost:5984/_utils, 
		Create admin user
		Login with admin user and go to Configuration
		Configure Single Node in setup
		Set bind_address to 0.0.0.0
		Set enable_cors to true
		Copy and paste member user from _users database of existing couchDB
		Stop and start couchDB
			net start "Apache CouchDB"
			net stop "Apache CouchDB"
		Open CouchDB web interface with local static ip
		Run aivpos_init.bat
	