package com.digicard;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.nfc.NdefMessage;
import android.nfc.NfcAdapter;
import android.os.Bundle;
import android.widget.Toast;

import com.digicard.util.MNdefMessage;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

    private NfcAdapter nfcAdapter;
    private PendingIntent mNfcPendingIntent;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        init();
    }

    private void init(){
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        mNfcPendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        //onNewIntent(this.getIntent());
        //Toast.makeText(this,getIntent().getAction(),Toast.LENGTH_LONG).show();
    }

    @Override
    protected String getMainComponentName() {
        return "DigiCard";
    }

    //for orientation
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        // do not call super. invokeDefaultOnBackPressed() as it will close the app.  Instead lets just put it in the background.
        moveTaskToBack(true);
    }

    //config NFC
    @Override
    public void onNewIntent(Intent intent) {
        setIntent(intent);

        if(NfcAdapter.ACTION_NDEF_DISCOVERED.equals(intent.getAction())){
            //NFC received
            WritableMap params = Arguments.createMap();
            //read message
            try {
                NdefMessage[] messages = MNdefMessage.getNDEFMessages(intent);
                if (messages.length > 0) {
                    String message = MNdefMessage.getByteArray(messages[0].toByteArray());
                    params.putString("nfcDetect", message);
                    //emit event
                    getReactInstanceManager().getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("nfcDetect", params);
                }
            }catch (NullPointerException ne){
                ne.printStackTrace();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        nfcAdapter.enableForegroundDispatch(this, mNfcPendingIntent, null, null);
    }

    @Override
    public void onPause() {
        super.onPause();
        nfcAdapter.disableForegroundDispatch(this);
    }
}
