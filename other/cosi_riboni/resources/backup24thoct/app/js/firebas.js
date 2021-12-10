private void startFirebasePresence(final String account,Context context) {

    FirebaseDatabase database = FirebaseDatabase.getInstance();
    final DatabaseReference onlineStatusRef = database.getReference("Status/"+account+"/sync_status");
    final DatabaseReference lastOnlineRef = database.getReference("Status/"+account+"/last_sync");
    final DatabaseReference lastStatusRef = database.getReference("Status/"+account+"/status");
    final DatabaseReference timeStatusRef = database.getReference("Status/"+account+"/timetrack");


    String android_id = android.provider.Settings.Secure.getString(context.getApplicationContext().getContentResolver(),
            android.provider.Settings.Secure.ANDROID_ID);
    final DatabaseReference deviceStatusRef = database.getReference("Status/"+account+"/devices/"+android_id+"/status");
    final DatabaseReference deviceStatusseenRef = database.getReference("Status/"+account+"/devices/"+android_id+"/last_seen");

    DatabaseReference connectedRef = database.getReference(".info/connected");

    connectedRef.addValueEventListener(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot snapshot) {
            boolean connected = snapshot.getValue(Boolean.class);
            if (connected) {
                //System.out.println("connected");
                Log.d("fireconnection","Change detected");
                //DatabaseReference con = onlineStatusRef.push();
                onlineStatusRef.onDisconnect().setValue(Boolean.FALSE);
                lastOnlineRef.onDisconnect().setValue(ServerValue.TIMESTAMP);
                lastStatusRef.onDisconnect().setValue("offline");



                onlineStatusRef.setValue(Boolean.TRUE);
                lastStatusRef.setValue("online");

                deviceStatusRef.setValue("online");
                deviceStatusRef.onDisconnect().setValue("offline");
                deviceStatusseenRef.onDisconnect().setValue(ServerValue.TIMESTAMP);
                //lastStatusRef.setValue("online");


                getTimeInfo(account,mainContext);


            } else {
                //System.out.println("not connected");
                Log.d("fireconnection","Change detected");
            }
        }

        @Override
        public void onCancelled(DatabaseError error) {
            System.err.println("Listener was cancelled");
        }
    });

}